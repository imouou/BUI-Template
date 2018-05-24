#import "AppDelegate.h"
#import <TouchCore/TouchCore.h>

@interface AppDelegate ()


@end

@implementation AppDelegate
//Info.plist中读取启动的html
#define START_PAGE [[NSBundle mainBundle] objectForInfoDictionaryKey:@"StartPage"]

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    [self launchApp];
    [self.window makeKeyAndVisible];
    return YES;
}

-(void)launchApp{
    TouchViewController * vc = [[TouchViewController alloc] init];
    vc.startPage=START_PAGE;
    PageInfo * page = [[PageInfo alloc]init];
    page.url = vc.startPage ;
    page.slideDir =@"left";
    page.vc =vc;
    TouchCoreViewController * tvc =[[TouchCoreViewController alloc] initWithPageObj:page andInitData:nil];
    [tvc setViewControllers:@[vc] animated:YES];
    [tvc setNavigationBarHidden:YES];
    self.window.rootViewController =tvc;
}

- (void)applicationWillResignActive:(UIApplication *)application {

}


- (void)applicationDidEnterBackground:(UIApplication *)application {

}


- (void)applicationWillEnterForeground:(UIApplication *)application {
    
}


- (void)applicationDidBecomeActive:(UIApplication *)application {
   
}


- (void)applicationWillTerminate:(UIApplication *)application {
    
}


@end
