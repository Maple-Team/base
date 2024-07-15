```log
stop success: 1
index.tsx:12 parent id:  2
child.tsx:10 child id:  2 true
child.tsx:51 child useEffect cleanup
useHooks.ts:25 useHooks effect cleanup {previousStopped: false, id: '1', isStopped: true}
child.tsx:48 child useEffect
useHooks.ts:19 useHooks effect {previousStopped: true, id: '2', isStopped: true}
child.tsx:10 child id:  2 undefined

# effect的依赖项发生改变，如果有clearnup的话，会执行cleanup，
useHooks.ts:25 useHooks effect cleanup {previousStopped: true, id: '2', isStopped: true}
# 然后再执行effect函数体里面的代码
useHooks.ts:19 useHooks effect {previousStopped: true, id: '2', isStopped: undefined}
```
