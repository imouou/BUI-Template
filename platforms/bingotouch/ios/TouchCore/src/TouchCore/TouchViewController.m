#import "TouchViewController.h"

@implementation TouchViewController


- (void)viewDidLoad
{
    [super viewDidLoad];
    
    NSNumber* statusBarNum = [self.settings objectForKey:@"HideStatusBar"];
    if(statusBarNum!=nil){
        BOOL hideStatusBar = [statusBarNum boolValue];
        if(hideStatusBar){
            [[UIApplication sharedApplication] setStatusBarHidden:YES];
        }
    }
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    return [super shouldAutorotateToInterfaceOrientation:interfaceOrientation];
}

//webview开始加载
-(void)webViewDidStartLoad:(UIWebView *)webView{
    [super webViewDidStartLoad:webView];
}


//webview加载完成
-(void)webViewDidFinishLoad:(UIWebView *)webView{
    [super webViewDidFinishLoad:webView];

}

//webview加载出错
-(void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error{
    [super webView:webView didFailLoadWithError:error];
}

@end







