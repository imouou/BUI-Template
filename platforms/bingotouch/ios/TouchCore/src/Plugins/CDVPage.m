#import "CDVPage.h"
#import "PageInfo.h"

@implementation CDVPage

-(void)loadUrl:(CDVInvokedUrlCommand *) command{
    NSDictionary* data=[command.arguments objectAtIndex:0];
    DLog(@"loadUrl data:%@",data);
    if(data!=nil){
        NSString* url=[data objectForKey:@"url"];
        NSString* slideType=[data objectForKey:@"slideType"];
        NSDictionary* params=[data objectForKey:@"params"];
        
        if (slideType==nil||[slideType isEqualToString:@""]) {
            slideType=@"left";
        }
        
        TouchViewController* vc=[[TouchViewController alloc] init];
        vc.useSplashScreen=NO;
        vc.startPage=url;
        PageInfo* page=[[PageInfo alloc] init];
        page.url=url;
        page.slideDir=slideType;
        page.appId=@"btapp";
        page.params=params;
        page.vc=vc;
        [self.touchCoreVC push:page animated:YES];
    }
}

-(void)back:(CDVInvokedUrlCommand *)command{
    NSString* callbackFunc=[command.arguments objectAtIndex:0];
    DLog(@"excute: %@",callbackFunc);
    if(self.touchCoreVC==nil){
        NSLog(@"%@",self.viewController);
        [self.viewController.navigationController dismissViewControllerAnimated:YES completion:nil];
        return;
    }
    [self.touchCoreVC pop:YES withCallback:callbackFunc];
}


-(void)refresh:(CDVInvokedUrlCommand *)command{
    [self.webView reload];
}

-(void)getPageParams:(CDVInvokedUrlCommand *)command{
    CDVPluginResult* pluginResult;
    NSDictionary* params=[self.touchCoreVC getCurrentParams];
    if (params!=nil) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[NSString stringWithFormat:@"%@",[params JSONString]]];
    }else{
        pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"{}"];
    }
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

-(void)getCurrentUri:(CDVInvokedUrlCommand *)command{
    CDVPluginResult* pluginResult;
    NSString *currentURL=self.webView.request.URL.absoluteString;
    pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:currentURL];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}
@end





