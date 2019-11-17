# run once to generate the key
"%java_home%\bin\keytool" -genkey -v -keystore ukc-release-key.keystore -alias ukc -keyalg RSA -keysize 2048 -validity 10000

# debug
ionic cordova run android --device -l --debug

# build
ionic cordova build android --release --prod
"%java_home%\bin\jarsigner" -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ukc-release-key.keystore c:\Users\Andrii\ionic\ukc\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk ukc
del c:\Users\Andrii\ionic\ukc\platforms\android\app\build\outputs\apk\release\1545.apk
"%android_sdk_root%\build-tools\29.0.2\zipalign" -v 4 c:\Users\Andrii\ionic\ukc\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk c:\Users\Andrii\ionic\ukc\platforms\android\app\build\outputs\apk\release\1545.apk
"%android_sdk_root%\build-tools\29.0.2\apksigner" verify c:\Users\Andrii\ionic\ukc\platforms\android\app\build\outputs\apk\release\1545.apk
