//
//  ASAQueue.m
//  ASADataStructures
//
//  Created by AndrewShmig on 3/14/13.
//  Copyright (c) 2013 AndrewShmig. All rights reserved.
//

#import "ASAQueue.h"

// ----------------- ASAQueue ------------- //
@implementation ASAQueue {
@protected
  NSMutableArray *_queue;
}

#pragma mark - Init methods
- (id)initWithArray:(NSArray *)array {
  
  self = [super init];
  
  if(self){
    _queue = [NSMutableArray arrayWithArray:array];
  }
  
  return self;
}

- (id)init {
  
  return [self initWithArray:@[]];
}

- (id)initWithASAQueue:(ASAQueue *)queue {
  
  return [self initWithArray:[queue queueObjects]];
}

#pragma mark - ASAQueue class creation methods
+ (instancetype)queueWithArray:(NSArray *)array {
  
  return [[ASAQueue alloc] initWithArray:array];
}

+ (instancetype)queueWithASAQueue:(ASAQueue *)queue {
  
  return [ASAQueue queueWithArray:[queue queueObjects]];
}

+ (instancetype)queue {
  
  return [ASAQueue queueWithArray:@[]];
}

#pragma mark - Getters
- (id)frontObject {
  
  if([_queue count] !=0 )
    return [_queue objectAtIndex:0];
  else
    return nil;
}

- (id)lastObject {
  
  return [_queue lastObject];
}

- (NSArray *)queueObjects {
  
  return [_queue copy];
}

- (NSUInteger)count {
  
  return [_queue count];
}

- (BOOL)isEmpty {
  
  return ([self count] == 0);
}

#pragma mark - Overriden methods
- (NSString *)description {
  
  return [NSString stringWithFormat:@"%@", _queue];
}

- (id)mutableCopy {
  
  return [[ASAMutableQueue alloc] initWithArray:_queue];
}

@end


// ---------------- ASAMutableQueue -------- //
@implementation ASAMutableQueue

#pragma mark - ASAMutableQueue class creation methods
+ (instancetype)queueWithArray:(NSArray *)array {
  
  return [[ASAMutableQueue alloc] initWithArray:array];
}

+ (instancetype)queueWithASAQueue:(ASAQueue *)queue {
  
  return [ASAMutableQueue queueWithArray:[queue queueObjects]];
}

+ (instancetype)queue {
  
  return [ASAMutableQueue queueWithArray:@[]];
}

#pragma mark - Manipulations
- (void)pushObject:(id)object {
  
  [_queue addObject:object];
}

- (id)popObject {
  
  if([self count] == 0)
    return nil;
  else {
    id removedObject = [_queue objectAtIndex:0];
    [_queue removeObjectAtIndex:0];
    
    return removedObject;
  }
}

- (void)removeAllObjects {
  
  [_queue removeAllObjects];
}

@end