#import <UIKit/UIKit.h>
#import "PageInfo.h"
#import "TouchViewController.h"

@interface TouchCoreViewController : UINavigationController

//页面堆栈
@property(nonatomic,strong) NSMutableArray* pageStack;
//全局变量存储
@property(nonatomic,strong)NSMutableDictionary* globalVariable;
//启动页面
@property(nonatomic,strong) NSString* defaultLoadUrl;
//配置信息
@property (readonly) NSMutableDictionary* settings;

-(id)initWithPageObj:(PageInfo*)page andInitData:(NSString*)data;
-(void)push:(PageInfo*) page animated:(BOOL)animated;
-(void)pop:(BOOL)animated withCallback:(NSString*)callbackFunc;
-(void)refreshViewController;
-(PageInfo*)getCurrentPage;
-(PageInfo*)getPreviousPage;
-(PageInfo*)getFirstPage;
-(UIViewController*) getCurrentVC;
-(NSDictionary*) getCurrentParams;
@end
