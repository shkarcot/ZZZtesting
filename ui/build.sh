#!/usr/bin/env bash
cd uam
chmod +x gulp.sh
sh gulp.sh
cd ..
cd ref-app
chmod +x gulp.sh
sh gulp.sh
cd ..
cd platform
chmod +x gulp.sh
sh gulp.sh
cd ..
