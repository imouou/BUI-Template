#import "TouchPlugin.h"
#import "TouchCoreViewController.h"
#import "TouchViewController.h"

@interface CDVPage : TouchPlugin

-(void)loadUrl:(CDVInvokedUrlCommand *) command;
-(void)back:(CDVInvokedUrlCommand *)command;
-(void)refresh:(CDVInvokedUrlCommand*)command;
-(void)getPageParams:(CDVInvokedUrlCommand *)command;
-(void)getCurrentUri:(CDVInvokedUrlCommand*)command;
@end
