ionic cordova build android --release --prod
"%java_home%\bin\keytool" -genkey -v -keystore ukc-release-key.keystore -alias ukc -keyalg RSA -keysize 2048 -validity 10000
"%java_home%\bin\jarsigner" -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ukc-release-key.keystore c:\Users\Andrii\ionic\ukc\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk ukc
"%android_sdk_root%\build-tools\29.0.2\zipalign" -v 4 c:\Users\Andrii\ionic\ukc\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk c:\Users\Andrii\ionic\ukc\platforms\android\app\build\outputs\apk\release\ukc.apk
