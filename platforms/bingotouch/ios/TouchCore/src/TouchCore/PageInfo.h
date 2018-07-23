#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "TouchViewController.h"

@interface PageInfo : NSObject

@property(nonatomic,strong) NSString* appId;
@property(nonatomic,strong) NSString* url;
@property(nonatomic,strong) NSString* slideDir;
@property(nonatomic,strong) NSDictionary* params;
@property(nonatomic,strong) TouchViewController* vc;
@end
