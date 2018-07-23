#import <Foundation/Foundation.h>
#import "CDVHashmap.h"

@implementation CDVHashmap

-(void)set:(CDVInvokedUrlCommand*)command
{
    NSString *id = command.arguments[0];
    NSString *key = command.arguments[1];
    NSString *value = command.arguments[2];
    
    NSString *path = [self getFilePathWithName:id];
    
    NSMutableDictionary *hashmap = [NSMutableDictionary dictionaryWithContentsOfFile:path];
    if (hashmap == nil) {
        hashmap = [NSMutableDictionary dictionary];
    }
    [hashmap setValue:value forKey:key];
    
    BOOL success = [hashmap writeToFile:path atomically:YES];
    if (success) {
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
}

-(void)get:(CDVInvokedUrlCommand *)command
{
    NSString *id = command.arguments[0];
    NSArray *keys = command.arguments[1];
    
    NSString *path = [self getFilePathWithName:id];
    NSMutableDictionary *hashmap = [NSMutableDictionary dictionaryWithContentsOfFile:path];
    
    NSMutableDictionary *keyValues = [[hashmap dictionaryWithValuesForKeys:keys] mutableCopy];
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:keyValues];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];

}

-(void)readKeys:(CDVInvokedUrlCommand *)command
{
    NSString *id = command.arguments[0];

    NSString *path = [self getFilePathWithName:id];
    NSMutableDictionary *hashmap = [NSMutableDictionary dictionaryWithContentsOfFile:path];
    
    NSArray *keys = [hashmap allKeys];
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:keys];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

-(void)readValues:(CDVInvokedUrlCommand *)command
{
    NSString *id = command.arguments[0];
    
    NSString *path = [self getFilePathWithName:id];
    NSMutableDictionary *hashmap = [NSMutableDictionary dictionaryWithContentsOfFile:path];
    
    NSArray *values = [hashmap allValues];
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:values];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

-(void)readAll:(CDVInvokedUrlCommand *)command
{
    NSString *id = command.arguments[0];
    
    NSString *path = [self getFilePathWithName:id];
    NSMutableDictionary *hashmap = [NSMutableDictionary dictionaryWithContentsOfFile:path];
        
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:hashmap];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

-(void)remove:(CDVInvokedUrlCommand *)command
{
    NSString *id = command.arguments[0];
    NSArray *keys = command.arguments[1];
    
    NSString *path = [self getFilePathWithName:id];
    
    NSMutableDictionary *hashmap = [NSMutableDictionary dictionaryWithContentsOfFile:path];

    [hashmap removeObjectsForKeys:keys];
    
    BOOL success = [hashmap writeToFile:path atomically:YES];
    if (success) {
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
}

-(void)clear:(CDVInvokedUrlCommand *)command
{
    NSString *id = command.arguments[0];
    
    NSString *path = [self getFilePathWithName:id];
    BOOL success = YES;
    if ([[NSFileManager defaultManager] fileExistsAtPath:path]) {
        success = [[NSFileManager defaultManager] removeItemAtPath:path error:nil];
    }
    if (success) {
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
}

//获取文件路径
-(NSString*)getFilePathWithName:(NSString*)name
{
    NSString *documentPath = [NSHomeDirectory() stringByAppendingPathComponent:@"Documents"];
    return [documentPath stringByAppendingPathComponent:name];
}
@end
