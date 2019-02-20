from connections.mongodb import MongoDbConn
from config_vars import DASHBOARD_CONFIG
from utilities.common import construct_dictionary
from services.dashboard import get_iters
from datetime import datetime, timedelta


def chart_selectors():
    return MongoDbConn.find_one(DASHBOARD_CONFIG, {"type": "selectors"})['time_selectors']


def chart_data(chart_id, selector, solution_id):
    result = MongoDbConn.find_one(DASHBOARD_CONFIG, {"chart_id": chart_id})
    resp = construct_dictionary(result, ["title"])
    if "time_selectors" in result.keys():
        resp["subtitle"] = get_subtitle(selector, result['time_selectors'])
    if "date" in result.keys():
        resp['date'] = return_date(selector)
    column_data = list()

    is_true = True
    for field in result['config']:
        field_data = construct_dictionary(field, ['name', "type", "color"])
        if chart_id == "one":
            resp["data_" + field['name'].lower()] = field_data['data'] = \
                list(reversed(construct_data(selector, field, solution_id)))
        else:
            is_true = False
            field_data['y'] = sum(construct_data(selector, field, solution_id))
        column_data.append(field_data)
    resp['series'] = edit_column_data(column_data) if is_true else [{"data": column_data}]
    return resp


def construct_data(selector, field, solution_id):
    data = list()
    iterlen = get_iters(selector)['length']
    iterstep = get_iters(selector)['step']
    query = dict()
    if field['key_type'] == 'string':
        query["$or"] = [{field['key']: str(field["name"]).lower()},
                        {field['key']: str(field["name"]).title()}]

    elif field['key_type'] == 'bool':
        if "," in field['key']:
            query["$or"] = [{key.strip():  True} for key in field['key'].split(",")]
        else:
            query[field['key']] = True

    # Common code to get count.
    end_day = datetime.now().replace(hour=23, minute=59, second=59)
    for i in range(iterlen):
        start_day = end_day + timedelta(days=-iterstep)
        query[field['timestamp']] = {'$lte': end_day, '$gte': start_day}
        query["solution_id"] = solution_id
        count = MongoDbConn.find(field['collection'], query).sort('_id', -1)
        end_day = start_day
        data.append(count.count())
    return data


def return_date(selector):
    iterlen = get_iters(selector)['length']-1
    iterstep = get_iters(selector)['step']
    return (datetime.now().replace(hour=0, minute=0, second=0) + timedelta(days=-(iterstep*iterlen))).date()


def get_subtitle(selector, selectors):
    return "".join([itm['title'] for itm in selectors if itm['value'] == selector])


def edit_column_data(column_data):
    new_list_a = list()
    new_list_c = list()
    for a, c in zip(column_data[0]["data"], column_data[1]["data"]):
        try:
            new_a = (a/(a+c))*100
            new_c = (c / (a + c)) * 100
        except ZeroDivisionError:
            new_a = new_c = 0
        new_list_a.append(round(new_a, 2))
        new_list_c.append(round(new_c, 2))
    column_data[0]["data"] = new_list_a
    column_data[1]["data"] = new_list_c
    return column_data
