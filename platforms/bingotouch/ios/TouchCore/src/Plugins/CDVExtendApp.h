#import "TouchPlugin.h"
#import <QuickLook/QuickLook.h>
#import "QLViewController.h"
#import <CoreTelephony/CTTelephonyNetworkInfo.h>
#import <CoreTelephony/CTCarrier.h>
#import "CCProgressHUD.h"


@interface CDVExtendApp :TouchPlugin<QLPreviewControllerDataSource, QLPreviewControllerDelegate, QLViewControllerDelegate>{
}
@property(nonatomic,strong) CCProgressHUD* mbhint;
@property(nonatomic,strong) CCProgressHUD* mbprogress;

-(void)hint:(CDVInvokedUrlCommand*)command;
-(void)progressStart:(CDVInvokedUrlCommand*)command;
-(void)progressStop:(CDVInvokedUrlCommand *)command;
-(void)isExistApp:(CDVInvokedUrlCommand *) command;
-(void)runApp:(CDVInvokedUrlCommand*)command;
-(void)getInfo:(CDVInvokedUrlCommand*)command;
-(void)getSize:(CDVInvokedUrlCommand*)command;
-(void)setVariable:(CDVInvokedUrlCommand*)command;
-(void)getVariable:(CDVInvokedUrlCommand*)command;
-(void)openFile:(CDVInvokedUrlCommand*)command;
-(void)getAppDirectoryEntry:(CDVInvokedUrlCommand*)command;
-(void)exit:(CDVInvokedUrlCommand*)command;
-(void)getSimInfo:(CDVInvokedUrlCommand*)command;
@end
