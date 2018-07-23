//
//  ASAQueue.h
//  ASADataStructures
//
//  Created by AndrewShmig on 3/14/13.
//  Copyright (c) 2013 AndrewShmig. All rights reserved.
//

#import <Foundation/Foundation.h>

// ----------------- ASAQueue ------------- //
@interface ASAQueue : NSObject

- (id)init;
- (id)initWithArray:(NSArray *)array;
- (id)initWithASAQueue:(ASAQueue *)queue;

+ (instancetype)queue;
+ (instancetype)queueWithArray:(NSArray *)array;
+ (instancetype)queueWithASAQueue:(ASAQueue *)queue;

- (id)frontObject;
- (id)lastObject;
- (NSArray *)queueObjects;
- (NSUInteger)count;
- (BOOL)isEmpty;

- (NSString *)description;
- (id)mutableCopy;

@end


// ---------------- ASAMutableQueue -------- //
@interface ASAMutableQueue : ASAQueue

- (void)pushObject:(id)object;
- (id)popObject;
- (void)removeAllObjects;

@end