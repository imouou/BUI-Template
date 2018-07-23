#import "HttpRequestPlugin.h"

@implementation NSDictionary (stringValue)

- (NSString*)stringValueForKey:(id)key
{
    id value = [self objectForKey:key];
    if ([value isKindOfClass:[NSString class]]) {
        return value;
    }
    else if ([value isKindOfClass:[NSNumber class]]) {
        return [value stringValue];
    }
    else if ([value isKindOfClass:[NSArray class]] || [value isKindOfClass:[NSDictionary class]] ) {
        return [value JSONString];
    }
    return @"";
}

@end

@interface HttpRequestPlugin ()

@property (nonatomic, strong) AFHTTPRequestOperationManager* httpManager;
@property (nonatomic, strong) AFHTTPRequestOperationManager* WSDLManager;
@end

@implementation HttpRequestPlugin


- (void)pluginInitialize
{
    self.httpManager = [AFHTTPRequestOperationManager manager];
    self.httpManager.securityPolicy.allowInvalidCertificates=YES;
    self.httpManager.securityPolicy.validatesDomainName = NO;
    AFHTTPResponseSerializer* responseSerializer = [AFHTTPResponseSerializer serializer];
    NSMutableSet* acceptableContentTypes  = [NSMutableSet setWithSet:self.httpManager.responseSerializer.acceptableContentTypes];
    [acceptableContentTypes addObject:@"text/html"];
    self.httpManager.responseSerializer = responseSerializer;
    
    
    self.WSDLManager=[AFHTTPRequestOperationManager manager];
    self.WSDLManager.requestSerializer=[AFHTTPRequestSerializer serializer];
    self.WSDLManager.responseSerializer=[AFHTTPResponseSerializer serializer];
    [self.WSDLManager.requestSerializer setValue:@"text/xml;charset=utf-8" forHTTPHeaderField:@"Content-Type"];
    self.WSDLManager.responseSerializer.acceptableContentTypes=[NSSet setWithObjects:@"text/html",@"text/plain",@"application/json", nil];
}

-(void)ajax:(CDVInvokedUrlCommand *)command{
    NSString* url=[command.arguments objectAtIndex:0];
    NSDictionary* data=[command.arguments objectAtIndex:1];
    NSString* method=[command.arguments objectAtIndex:2];
    NSString* contentType=[command.arguments objectAtIndex:4];
    NSDictionary* headers=[command.arguments objectAtIndex:5];
    int timeout=[[command.arguments objectAtIndex:6] intValue];
    
    if ([method.uppercaseString isEqualToString:@"GET"]) {
        [self get:url withParameters:data withTimeout:timeout withHeaders:headers withContentType:contentType withCallbackId:command.callbackId];
        
    }else if([method.uppercaseString isEqualToString:@"POST"]){
        [self post:url withParameters:data withTimeout:timeout withHeaders:headers withContentType:contentType withCallbackId:command.callbackId];
    }
    else {
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"invalid http method!"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
    
}

-(void)get:(NSString*)url withParameters:(NSDictionary*)parameters withTimeout:(int)timeout withHeaders:(NSDictionary*)headers withContentType:(NSString*)contentType withCallbackId:(NSString*)callbackId{
    
    
    //加上contentType
    if ([contentType isEqualToString:@""]) {
        contentType=@"application/x-www-form-urlencoded";
    }
    
    if ([contentType isEqualToString:@"application/json"]) {
        self.httpManager.requestSerializer = [AFJSONRequestSerializer serializerWithWritingOptions:0];
    }
    else {
        self.httpManager.requestSerializer = [AFHTTPRequestSerializer serializer];
        [self.httpManager.requestSerializer setValue:contentType forHTTPHeaderField:@"Content-Type"];
    }
    
    //加上请求头
    if(headers!=nil&&headers.count>0){
        for (NSString* key in headers.keyEnumerator) {
            id value=[headers objectForKey:key];
            [self.httpManager.requestSerializer setValue:value forHTTPHeaderField:key];
        }
    }
    
    //加上accesstoken
    NSString* accessToken=[self.touchCoreVC.globalVariable objectForKey:@"SSO_ACCESSTOKEN"];
    if ([accessToken isKindOfClass:[NSString class]]&&accessToken.length>0) {
        [self.httpManager.requestSerializer setValue:[@"Bearer" stringByAppendingString:accessToken] forHTTPHeaderField:@"Authorization"];
    }
    
    self.httpManager.requestSerializer.timeoutInterval = timeout/1000;
    
    [self.httpManager GET:url parameters:parameters success:^(AFHTTPRequestOperation* operation,id responseObject){
        
        NSData * data=responseObject;
        NSString * result=[[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
        NSString* code= [NSString stringWithFormat:@"%ld",operation.response.statusCode];
        NSDictionary* response=[[NSDictionary alloc] initWithObjectsAndKeys:result,@"returnValue",code,@"code", nil];
        NSLog(@"回调ID:%@, 回调数据:%@",callbackId,response);
        CDVPluginResult* pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[response JSONString]];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
        
    } failure:^(AFHTTPRequestOperation* operation,NSError* error){
        
        NSLog(@"回调ID:%@, 错误信息:%@",callbackId,[error description]);
        //通知link刷accessToken
        if (operation.response.statusCode==401) {
            [[NSNotificationCenter defaultCenter] postNotificationName:@"btAppAccessTokenExpired" object:nil userInfo: nil];
        }
        NSString* code= [NSString stringWithFormat:@"%ld",operation.response.statusCode];
        NSDictionary* response=[[NSDictionary alloc] initWithObjectsAndKeys:[error description],@"returnValue",code,@"code", nil];
        CDVPluginResult* pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[response JSONString]];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
        
    }];
}


-(void)post:(NSString*)url withParameters:(NSDictionary*)parameters withTimeout:(int)timeout withHeaders:(NSDictionary*)headers withContentType:(NSString*)contentType withCallbackId:(NSString*)callbackId{
    //加上contentType
    if ([contentType isEqualToString:@""]) {
        contentType=@"application/x-www-form-urlencoded";
    }
    
    if ([contentType isEqualToString:@"application/json"]) {
        self.httpManager.requestSerializer = [AFJSONRequestSerializer serializerWithWritingOptions:0];
    }
    else {
        self.httpManager.requestSerializer = [AFHTTPRequestSerializer serializer];
        [self.httpManager.requestSerializer setValue:contentType forHTTPHeaderField:@"Content-Type"];
    }
    
    
    //加上请求头
    if(headers!=nil&&headers.count>0){
        for (NSString* key in headers.keyEnumerator) {
            id value=[headers objectForKey:key];
            [self.httpManager.requestSerializer setValue:value forHTTPHeaderField:key];
        }
    }
    
    //加上accesstoken
    NSString* accessToken=[self.touchCoreVC.globalVariable objectForKey:@"SSO_ACCESSTOKEN"];
    if ([accessToken isKindOfClass:[NSString class]]&&accessToken.length>0) {
        [self.httpManager.requestSerializer setValue:[@"Bearer" stringByAppendingString:accessToken] forHTTPHeaderField:@"Authorization"];
    }
    
    self.httpManager.requestSerializer.timeoutInterval = timeout/1000;
    
    [self.httpManager POST:url parameters:parameters success:^(AFHTTPRequestOperation* operation,id responseObject){
        
        NSData * data=responseObject;
        NSString * result=[[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
        NSString* code= [NSString stringWithFormat:@"%ld",operation.response.statusCode];
        NSDictionary* response=[[NSDictionary alloc] initWithObjectsAndKeys:result,@"returnValue",code,@"code", nil];
        NSLog(@"回调ID:%@, 回调数据:%@",callbackId,response);
        CDVPluginResult* pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[response JSONString]];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
        
    } failure:^(AFHTTPRequestOperation* operation,NSError* error){
        
        NSLog(@"回调ID:%@, 错误信息:%@",callbackId,[error description]);
        //通知link刷accessToken
        if (operation.response.statusCode==401) {
            [[NSNotificationCenter defaultCenter] postNotificationName:@"btAppAccessTokenExpired" object:nil userInfo: nil];
        }
        NSString* code= [NSString stringWithFormat:@"%ld",operation.response.statusCode];
        NSDictionary* response=[[NSDictionary alloc] initWithObjectsAndKeys:[error description],@"returnValue",code,@"code", nil];
        CDVPluginResult* pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[response JSONString]];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
        
    }];
}
@end
