#!/bin/bash

##############################
# IPA auto-build script
# 
##############################
cd "$(dirname "$0")";
##授权Pods目录
chmod -R 777 $(pwd)/Pods
##执行pod install安装
pod install

##当前脚本运行目录
ProjectPath=$(pwd)
##当前project或者workspace的文件名
ProjectName="TouchCoreTemplate" #当前工程的名称，以最后生成的 TempApp.xcworkspace 为准
##描述文件路径
ProvisionFile="${ProjectPath}/app.mobileprovision" #描述文件

WorkspacePath="${ProjectPath}/${ProjectName}.xcworkspace"
ArchivePath="${ProjectPath}/build/${ProjectName}.xcarchive"
Scheme="${ProjectName}"
InfoPlistPath="${ProjectPath}/${ProjectName}/Info.plist"
OutputPath="${ProjectPath}/build/Release-iphoneos"
ExportOptionsPath="${ProjectPath}/ExportOptions.plist"
ProvisionPlistFile="${ProjectPath}/ProvisionFile.plist"

ConfigPlist="${ProjectPath}/Config.plist" #抽象出来的配置文件

##输入
BundleId={#BundleId#} #你的Bundle ID
BuildType={#BuildType#} #build method app-store or enterprise

##第一步:将描述文件转成plist，并读取里面的关键字段
security cms -D -i "${ProvisionFile}" > "${ProvisionPlistFile}"

###获取UUID
Provision_UUID=`defaults read "${ProvisionPlistFile}" UUID`
echo "UUID:"${Provision_UUID}

###获取TeamID
Provision_TeamIdentifier=`defaults read "${ProvisionPlistFile}" TeamIdentifier`
echo "TeamIdentifier:"${Provision_TeamIdentifier}

touch temp.txt
echo ${Provision_TeamIdentifier} > temp.txt
##去掉空格和括号
Provision_TeamIdentifier=`cat temp.txt | sed 's/[[:space:]]//g' | sed 's/[()]//g'`
echo ${Provision_TeamIdentifier}
rm temp.txt

###获取TeamName
Provision_TeamName=`defaults read "${ProvisionPlistFile}" TeamName`
echo "TeamName:"${Provision_TeamName}

###获取描述文件名称
Provision_Name=`defaults read "${ProvisionPlistFile}" Name`
echo "Name:"${Provision_Name}

##第二步:生成 build.xcconfig，并写入配置信息
XcconfigPath="${ProjectPath}/build.xcconfig"
cat>${XcconfigPath}<<EOF
DevelopmentTeam =${Provision_TeamIdentifier}
PROVISIONING_PROFILE = ${Provision_UUID}
CODE_SIGN_IDENTITY = iPhone Distribution: ${Provision_TeamName}
PRODUCT_BUNDLE_IDENTIFIER = ${BundleId}
EOF

##第三步:生成 exportOptions.plist
cat>${ExportOptionsPath}<<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>provisioningProfiles</key>
	<dict>
		<key>${BundleId}</key>
		<string>${Provision_Name}</string>
	</dict>
	<key>teamID</key>
	<string>${Provision_TeamIdentifier}</string>
	<key>method</key>
	<string>${BuildType}</string>
	<key>uploadSymbols</key>
	<true/>
</dict>
</plist>
EOF
# exit

###第四步：执行clean,archive,export
## clean project
xcodebuild clean -workspace "${WorkspacePath}" -scheme "${Scheme}" -configuration Release
## archive project
xcodebuild archive -workspace "${WorkspacePath}" -scheme "${Scheme}" -archivePath "${ArchivePath}" -xcconfig "${XcconfigPath}"
## export ipa
xcodebuild -exportArchive -archivePath "${ArchivePath}" -exportPath "${OutputPath}" -exportOptionsPlist "${ExportOptionsPath}"

###第六步：重命名ipa
#rename : bundleid_version.ipa
mv ${OutputPath}/${ProjectName}.ipa ${OutputPath}/release.ipa 

exit