#!/bin/bash
#

cp ../dockercomposeconfig/app/nonprod/app/pwa/variables.env.ts .
cp ../dockercomposeconfig/app/nonprod/app/pwa/capacitor.config.json .
cp ../dockercomposeconfig/app/nonprod/app/native/google-services.json ./android/app
cp ../dockercomposeconfig/app/nonprod/app/native/strings.xml ./android/app/src/main/res/values/
cp variables.env.ts src/environments/environment.ts
