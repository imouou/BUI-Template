#import "CDVSettingPlugin.h"

static NSString* strPre=@"bt:"; //存储的前缀
static int capacity=20; //存储的容量


@implementation CDVSettingPlugin

//配置项前面加个bt:防止冲突和方便获取全部
//设置配置项
-(void)set:(CDVInvokedUrlCommand *)command{
    NSString* key=[command.arguments objectAtIndex:0];
    NSString* value=[command.arguments objectAtIndex:1];
    
    NSUserDefaults* defaults=[NSUserDefaults standardUserDefaults];
    if(defaults){
        [defaults setObject:value forKey:[strPre stringByAppendingString:key]];
        CDVPluginResult* pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
}

//获取某配置项
-(void)get:(CDVInvokedUrlCommand *)command{
    NSString* key=[command.arguments objectAtIndex:0];
    //如果没有去到值就返回该默认值
    NSString* defaultValue=[command.arguments objectAtIndex:1];
    NSUserDefaults* defaults=[NSUserDefaults standardUserDefaults];
    NSString* result=[defaults objectForKey:[strPre stringByAppendingString:key]];
    if (result==nil) {
        result=defaultValue;
    }
    CDVPluginResult* pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:result];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

//移除某一配置项
-(void)remove:(CDVInvokedUrlCommand *)command{
    NSString* key=[command.arguments objectAtIndex:0];
    NSUserDefaults* defaults=[NSUserDefaults standardUserDefaults];
    NSString* keyStr=[strPre stringByAppendingString:key];
    if([defaults objectForKey:keyStr]!=nil){
        [defaults removeObjectForKey:keyStr];
    }
}

//清除配置文件：
-(void)clear:(CDVInvokedUrlCommand *)command{
    NSUserDefaults* defaults=[NSUserDefaults standardUserDefaults];
    NSDictionary * p=[defaults dictionaryRepresentation];
    NSArray* keys=[p allKeys];
    for (int i=0; i<keys.count; i++) {
        //带有bt:才清除掉
        if([keys[i] hasPrefix:strPre]){
            [defaults removeObjectForKey:keys[i]];
        }
    }
}

//获取所有的配置项信息
-(void)load:(CDVInvokedUrlCommand *)command{
    NSUserDefaults* defaults=[NSUserDefaults standardUserDefaults];
    NSDictionary * p=[defaults dictionaryRepresentation];
    NSArray* keys=[p allKeys];
    
    NSMutableDictionary* result=[[NSMutableDictionary alloc] initWithCapacity:capacity];
    for (int i=0; i<keys.count; i++) {
        //带有bt:才清除掉
        if([keys[i] hasPrefix:strPre]){
            NSString * value=[p valueForKey:keys[i]];
            [result setObject:value forKey:[keys[i] substringFromIndex:strPre.length]];
            //NSLog(@"key:%@",[keys[i] substringFromIndex:3]);
        }
    }
    CDVPluginResult* pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[NSString stringWithString:[result JSONString]]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end












