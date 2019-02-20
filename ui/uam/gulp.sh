echo "working directory: `pwd`"
gulp clean
echo "dist folder is cleaned"

if [ "$BRAND" = "xpms" ]
then
	python3 find_replace.py --dir . -g "*.scss"  --search-regex "deloitte"  --replace-regex "xpms"
fi

if [ "$BRAND" = "enso" ]
then
	python3 find_replace.py --dir . -g "*.scss"  --search-regex "deloitte"  --replace-regex "enso"
fi

if [ "$BRAND" = "cogx" ]
then
	python3 find_replace.py --dir . -g "*.scss"  --search-regex "enso"  --replace-regex "deloitte"
fi

gulp package

python3 find_replace.py --dir dist/  --search-regex "src=\"vendor.js\""  --replace-regex "src=\"/static/uam/vendor.js\""
python3 find_replace.py --dir dist/  --search-regex "src=\"app.js\""  --replace-regex "src=\"/static/uam/app.js\""
python3 find_replace.py --dir dist/  --search-regex "href=\"vendor.css\""  --replace-regex "href=\"/static/uam/vendor.css\""
python3 find_replace.py --dir dist/  --search-regex "href=\"favicon.ico"  --replace-regex "href=\"/static/uam/favicon.ico"
python3 find_replace.py --dir dist/  --search-regex "/app/images"  --replace-regex "/static/uam/app/images"

gulp copy
chmod -R 777 ../../static/uam/
chmod -R 777 dist/

