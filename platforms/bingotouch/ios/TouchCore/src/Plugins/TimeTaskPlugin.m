

#import "TimeTaskPlugin.h"

@implementation TimeTaskPlugin

-(void)taskStart:(CDVInvokedUrlCommand *)command{
    CDVPluginResult* pluginResult=nil;
    NSDictionary* params= [command.arguments objectAtIndex:0];
    NSString* taskId=[params objectForKey:@"id"];
    int maxCount=[[params objectForKey:@"maxCount"] integerValue];
    NSString* taskAction=[params objectForKey:@"taskAction"];
    int loopTime=[[params objectForKey:@"loopTime"] integerValue];
    Boolean isImmedidate=[[params objectForKey:@"isImmediate"] boolValue];
    
    NSMutableDictionary * result=[[NSMutableDictionary alloc] init];
    
    if(![self.touchCoreVC.globalVariable objectForKey:taskId]){
        EasyTimeline* timeline=[[EasyTimeline alloc] init];
        if (isImmedidate) {
            //立刻执行的情况下减一
            timeline.duration=(maxCount-1)*(loopTime/1000);
        }else{
            timeline.duration=maxCount*(loopTime/1000); //持续时长为loopTime和最大循环次数的乘积
        }
        
        timeline.tickPeriod=loopTime/1000; //转换成秒
        timeline.tickBlock=^void(NSTimeInterval time, EasyTimeline *timeline){
            //要在所有的webview中都正常运行，那么需要实时获取当前的webview
            TouchViewController *tvc = (TouchViewController*)[self.touchCoreVC getCurrentVC];
            [tvc.webView performSelectorOnMainThread:@selector(stringByEvaluatingJavaScriptFromString:) withObject:taskAction waitUntilDone:NO];
        };
        timeline.completionBlock= ^void (EasyTimeline *timeline) {
            TouchViewController *tvc = (TouchViewController*)[self.touchCoreVC getCurrentVC];
            [tvc.webView performSelectorOnMainThread:@selector(stringByEvaluatingJavaScriptFromString:) withObject:taskAction waitUntilDone:NO];
            //完成后将任务干掉
            [timeline stop];
            [self.touchCoreVC.globalVariable removeObjectForKey:taskId];
        };
        
        //如果立刻执行在任务开始之前先执行一次
        if (isImmedidate) {
            TouchViewController *tvc = (TouchViewController*)[self.touchCoreVC getCurrentVC];
            [tvc.webView performSelectorOnMainThread:@selector(stringByEvaluatingJavaScriptFromString:) withObject:taskAction waitUntilDone:NO];
        }
        [timeline start];
        
        //存在运行时变量里面
        [self.touchCoreVC.globalVariable setValue:timeline forKey:taskId];
        [result setObject:taskId forKey:@"id"];
        [result setObject:@"success" forKey:@"status"];
        [result setObject:@"" forKey:@"desc"];
    }else{
        NSLog(@"已经存在该任务");
        [result setObject:taskId forKey:@"id"];
        [result setObject:@"fail" forKey:@"status"];
        [result setObject:@"已经存在该任务" forKey:@"desc"];
    }
    pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[result JSONString]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

-(void)taskStop:(CDVInvokedUrlCommand *)command{
    NSString * taskId=[command.arguments objectAtIndex:0];
    NSMutableDictionary * result=[[NSMutableDictionary alloc] init];
    CDVPluginResult* pluginResult;
    [result setObject:taskId forKey:@"id"];
    if([self.touchCoreVC.globalVariable objectForKey:taskId]){
        EasyTimeline * timeline=(EasyTimeline*)[self.touchCoreVC.globalVariable objectForKey:taskId];
        [timeline stop];
        [self.touchCoreVC.globalVariable removeObjectForKey:taskId];
        if(!timeline.isRunning){
            [result setObject:@"success" forKey:@"status"];
            [result setObject:@"desc" forKey:@""];
        }else{
            [result setObject:@"fail" forKey:@"status"];
            [result setObject:@"desc" forKey:@"任务无法停止"];
        }
    }else{
        [result setObject:@"fail" forKey:@"status"];
        [result setObject:@"desc" forKey:@"指定的任务不存在"];
    }
    pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[result JSONString]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end






