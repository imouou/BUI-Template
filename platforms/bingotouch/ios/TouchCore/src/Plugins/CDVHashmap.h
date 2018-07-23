#import "TouchPlugin.h"

@interface CDVHashmap : TouchPlugin

-(void)set:(CDVInvokedUrlCommand*)command;
-(void)get:(CDVInvokedUrlCommand*)command;
-(void)readKeys:(CDVInvokedUrlCommand*)command;
-(void)readValues:(CDVInvokedUrlCommand*)command;
-(void)readAll:(CDVInvokedUrlCommand*)command;
-(void)remove:(CDVInvokedUrlCommand*)command;
-(void)clear:(CDVInvokedUrlCommand*)command;

@end
