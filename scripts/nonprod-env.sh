#!/bin/bash
#

cp ../dockercomposeconfig/app/nonprod/app/variables.env.ts .
cp ../dockercomposeconfig/app/nonprod/app/capacitor.config.json .
cp ../dockercomposeconfig/app/nonprod/app/google-services.json ./android/app
cp ../dockercomposeconfig/app/nonprod/app/strings.xml ./android/app/src/main/res/values/
cp variables.env.ts src/environments/environment.ts
