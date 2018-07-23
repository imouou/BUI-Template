#import "CDVExtendApp.h"
#import "CCProgressHUD.h"

@implementation CDVExtendApp
@synthesize mbhint;
@synthesize mbprogress;

-(void)hint:(CDVInvokedUrlCommand*)command{
    NSString* message= [command.arguments objectAtIndex:0];
    self.mbhint= [CCProgressHUD showHUDAddedTo:self.viewController.view animated:YES];
    self.mbhint.labelText = message;
    self.mbhint.mode=CCProgressHUDModeText;
    self.mbhint.margin = 10.f;
    self.mbhint.yOffset = 150.f;
    self.mbhint.removeFromSuperViewOnHide = YES;
    self.mbhint.userInteractionEnabled=NO;
    [self.mbhint hide:YES afterDelay:2];
}

-(void)progressStart:(CDVInvokedUrlCommand*)command{
    NSString* title=[command.arguments objectAtIndex:0];
    NSString* message=[command.arguments objectAtIndex:1];
    BOOL isMasked=true;
    if(command.arguments.count>2){
        isMasked=[[command.arguments objectAtIndex:2] boolValue];
    }
    if (self.mbprogress==nil) {
        self.mbprogress=[[CCProgressHUD alloc] initWithView:self.viewController.view];
    }
    [self.viewController.view addSubview:self.mbprogress];
    self.mbprogress.labelText =title;
    self.mbprogress.detailsLabelText =message;
    self.mbprogress.square = YES;
    if (isMasked) {
        self.mbprogress.userInteractionEnabled=YES;
    }else{
         self.mbprogress.userInteractionEnabled=NO;
    }
    [self.mbprogress show:true];
}

-(void)progressStop:(CDVInvokedUrlCommand *)command{
    if(self.mbprogress !=nil){
        [self.mbprogress hide:YES];
    }
}

-(void)isExistApp:(CDVInvokedUrlCommand *)command{
    NSString* urlSchemes=[command.arguments objectAtIndex:0];
    BOOL result = [[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:urlSchemes]];
    CDVPluginResult* pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:result];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

-(void)runApp:(CDVInvokedUrlCommand *)command{
     NSURL * url=[NSURL URLWithString:[command.arguments objectAtIndex:0]];
     [[UIApplication sharedApplication] openURL:url];
}

-(void)getInfo:(CDVInvokedUrlCommand*)command{
    //versionCode, versionName ,id,appName
    NSDictionary* infoDict =[[NSBundle mainBundle] infoDictionary];
    
    NSString* versionCode =[infoDict objectForKey:@"CFBundleVersion"];
    
    NSString* versionName=[infoDict objectForKey:@"CFBundleShortVersionString"];
    
    NSString* appName =[infoDict objectForKey:@"CFBundleDisplayName"];
    
    NSString* id=[infoDict objectForKey:@"CFBundleIdentifier"];
    
    
    NSDictionary* result=[[NSDictionary alloc] initWithObjectsAndKeys:
                          id,@"id",versionCode,@"versionCode",versionName,@"versionName",appName,@"appName", nil];
    CDVPluginResult* pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[NSString stringWithFormat:@"%@",[result JSONString]]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

-(void)getSize:(CDVInvokedUrlCommand*)command{
    //得到当前屏幕的尺寸：
    CGRect rect_screen = [[UIScreen mainScreen]bounds];
    CGSize size_screen = rect_screen.size;
    
    //获得scale：
    CGFloat scale_screen = [UIScreen mainScreen].scale;
    int width = size_screen.width*scale_screen;
    int height = size_screen.height*scale_screen;
    
    //屏幕尺寸的宽高与scale的乘积就是相应的分辨率值。
    //返回的对象
    NSDictionary* result=[[NSDictionary alloc] initWithObjectsAndKeys:
                         @(width) ,@"width",
                        @(height) ,@"height", nil];
    CDVPluginResult* pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[NSString stringWithFormat:@"%@",[result JSONString]]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

-(void)setVariable:(CDVInvokedUrlCommand*)command{
    NSString * key=[command.arguments objectAtIndex:0];
    NSString * value=[command.arguments objectAtIndex:1];
    [self.touchCoreVC.globalVariable setObject:value forKey:key];
}

-(void)getVariable:(CDVInvokedUrlCommand*)command{
    NSString* key=[command.arguments objectAtIndex:0];
    CDVPluginResult* pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[self.touchCoreVC.globalVariable objectForKey:key]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

-(void)openFile:(CDVInvokedUrlCommand*)command{
    NSString* filePath=[command.arguments objectAtIndex:0];
    CDVPluginResult* pluginResult=nil;
    if (![filePath isEqualToString:@""]) {
        QLViewController* ql=[[QLViewController alloc] init];
        ql.qlFileUrl=[NSURL fileURLWithPath:[command.arguments objectAtIndex:0]];
        if (self.viewController.presentedViewController) {
            [self.viewController dismissViewControllerAnimated:NO completion:nil];
        }
        [self.viewController presentViewController:ql animated:YES completion:nil];
        pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"ok"];
    }else{
        pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"cannot open file."];
    }
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

-(void)getAppDirectoryEntry:(CDVInvokedUrlCommand*)command{
    //沙盒主目录路径
    NSString* home=NSHomeDirectory();
    //Documents目录路径
    NSArray *docPaths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *docDir = [docPaths objectAtIndex:0];
    
    //Caches目录
    NSArray *cachePaths = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
    NSString *cachesDir = [cachePaths objectAtIndex:0];
    // 获取tmp目录路径
    NSString *tmpDir =  NSTemporaryDirectory();
    
    NSDictionary* result=[NSDictionary dictionaryWithObjectsAndKeys:
                          home,@"home",docDir,@"documents",cachesDir,@"caches",tmpDir,@"tmp"
                          , nil];
    CDVPluginResult* pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[NSString stringWithFormat:@"%@",[result JSONString]]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

-(void)exit:(CDVInvokedUrlCommand*)command{
    if (self.touchCoreVC.navigationController!=nil) {
        [self.touchCoreVC.navigationController popViewControllerAnimated:YES];
    }
    else {
        [self.touchCoreVC dismissViewControllerAnimated:YES completion:nil];
    }
}

//获取sim卡信息
-(void)getSimInfo:(CDVInvokedUrlCommand *)command{
    
}


@end







