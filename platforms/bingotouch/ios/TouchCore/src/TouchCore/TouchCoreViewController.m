#import "TouchCoreViewController.h"

@implementation TouchCoreViewController

@synthesize pageStack;
@synthesize globalVariable;

- (void)viewDidLoad
{
    [super viewDidLoad];
    self.navigationBar.translucent = NO;
    self.edgesForExtendedLayout = UIRectEdgeNone;
    if(@available(iOS 11.0, *)){
        UIScrollView.appearance.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
    }
    
}

-(void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
}

-(void)viewWillDisappear:(BOOL)animated{
    [super viewWillDisappear:animated];
}

//初始化，允许传入其他参数
-(id)initWithPageObj:(PageInfo*)page andInitData:(NSString*)data{
    self=[super init];
    if (self) {
        page.vc.touchCore = self;
        self.pageStack=[NSMutableArray arrayWithObject:page];
        self.globalVariable=[[NSMutableDictionary alloc] init];
        [self addPage:page];
        
        if(data!=nil){
            //其他应用启动的时候传过来的参数
            NSMutableDictionary* initData=[data JSONObject] ;
            //jsonkit: [data objectFromJSONStringWithParseOptions:JKParseOptionLooseUnicode];
            NSDictionary* ssoObj=[initData objectForKey:@"sso"];
            if ([ssoObj objectForKey:@"accessToken"]!=nil) {
                [self updateAccessToken:[ssoObj objectForKey:@"accessToken"]];
            }
        }
        [self watchNoti];
    }
    return self;
}

-(void)watchNoti{
    //监听accessToken
    NSString * KEY_LINKAT = @"kNotificationBingoLinkAccessTokenUpdate";
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(listenLinkATNoti:) name:KEY_LINKAT object:nil ];
}

-(void)listenLinkATNoti:(NSNotification*)noti{
    [self updateAccessToken:[noti object]];
}

-(void)updateAccessToken:(NSString*)token{
    if(self.globalVariable!=nil){
          [self.globalVariable setObject:token forKey:@"SSO_ACCESSTOKEN"];
    }
}

//push viewcontroller
-(void)push:(PageInfo*) page animated:(BOOL)animated{
    [self addPage:page];
    [super pushViewController:page.vc animated:YES];
}

//pop viewcontroller
-(void)pop:(BOOL)animated withCallback:(NSString*)callbackFunc{
    if (self.pageStack.count <= 1){
        if (self.navigationController) {
            [self.navigationController popViewControllerAnimated:YES];
        }
        else {
            [self dismissViewControllerAnimated:YES completion:nil];
        }
        return;
    }
    //前一个
    PageInfo* previousPage=[self getPreviousPage];
    
    //推出堆栈
    [self.pageStack removeLastObject];
    
    if (![callbackFunc isKindOfClass:[NSNull class]]) {
        [previousPage.vc.webView stringByEvaluatingJavaScriptFromString:callbackFunc];
    }
    
    [super popViewControllerAnimated:YES];
}

-(NSMutableDictionary*)settings
{
    TouchViewController *tvc = (TouchViewController*)[self getCurrentVC];
    return tvc.settings;
}

- (void)addPage:(PageInfo*)page
{
    [self.pageStack addObject:page];
    page.vc.touchCore = self;
}

//获取当前vc
-(UIViewController*) getCurrentVC{
    return [self getCurrentPage].vc;
};

//获取当前页面对象
-(PageInfo*) getCurrentPage{
    return [self.pageStack lastObject];
}

//获取上个页面对象
-(PageInfo*) getPreviousPage{
    NSUInteger count=self.pageStack.count;
    return [self.pageStack objectAtIndex:count-2];
}

//获取第一个页面对象
-(PageInfo*) getFirstPage{
    return self.pageStack[0];
}

//获取当前页面的参数
-(NSDictionary*) getCurrentParams{
    PageInfo* page=[self.pageStack lastObject];
    return page.params;
}

//刷新当前的webview
-(void)refreshViewController{
    TouchViewController * cvc=(TouchViewController*) [self getCurrentVC];
    [cvc.webView reload];
}

- (void)dealloc
{
    DLog(@"TouchCoreViewController dealloced!!!");
}

@end







