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

python3 find_replace.py --dir dist/  --search-regex "src=\"vendor.js\""  --replace-regex "src=\"/static/platform/vendor.js\""
python3 find_replace.py --dir dist/  --search-regex "src=\"app.js\""  --replace-regex "src=\"/static/platform/app.js\""
python3 find_replace.py --dir dist/  --search-regex "href=\"vendor.css\""  --replace-regex "href=\"/static/platform/vendor.css\""
python3 find_replace.py --dir dist/  --search-regex "href=\"favicon.ico"  --replace-regex "href=\"/static/platform/favicon.ico"
python3 find_replace.py --dir dist/  --search-regex "/app/images"  --replace-regex "/static/platform/app/images"

gulp copy
chmod -R 777 ../../static/platform/
chmod -R 777 dist/

