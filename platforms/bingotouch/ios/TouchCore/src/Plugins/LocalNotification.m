
#import "LocalNotification.h"

@implementation LocalNotification{
    NSString* callbackId;
}

//创建消息提醒
-(void)notify:(CDVInvokedUrlCommand *)command{
    UILocalNotification * localNotification=[[UILocalNotification alloc]init];
    NSString* title=command.arguments[0];
    NSString* body=command.arguments[1];
    Boolean isAutoDisapper=[command.arguments[2] boolValue]; //是否自动消失
    NSString* disapperTime=command.arguments[3]; //消失时间
    NSString* funcName=command.arguments[4]; //传给消息的方法，点击消息题后执行
    NSString* funcParams=command.arguments[5];//传给消息体的参数
    
    //发送通知到时间，默认是1s后立刻发送
    NSDate *pushDate = [NSDate dateWithTimeIntervalSinceNow:1];
    localNotification.fireDate=pushDate;
    localNotification.timeZone=[NSTimeZone defaultTimeZone];
    localNotification.repeatInterval=0; //不重复
    localNotification.soundName=UILocalNotificationDefaultSoundName;
    localNotification.alertAction=title;
    localNotification.alertBody=body;
    //self.touchCoreVC.localNotification.applicationIconBadgeNumber++;//小红点
    
    //带给消息体的内容
    NSMutableDictionary* userInfo=[[NSMutableDictionary alloc]init];
    
    //传过来的是1，0或者true，false
    if(isAutoDisapper==true){
       [userInfo setValue:disapperTime forKey:@"disapperTime"]; //通知消失时间
    }
    [userInfo setValue:funcName forKey:@"funcName"]; //方法名称
    [userInfo setValue:funcParams forKey:@"funcParams"]; //点击消息体执行的js方法
    [localNotification setUserInfo:userInfo];

    UIApplication* app=[UIApplication sharedApplication];
    [app scheduleLocalNotification:localNotification];
    //改变通知栏
    [KGStatusBar showSuccessWithStatus:body];
 
}

@end







