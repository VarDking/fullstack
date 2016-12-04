/**
 * Created by chen on 16/12/4.
 *
 */
"use strict";
module.exports = first;

/**
 * @param stuff
 * @param [done]
 */
function first(stuff, done){
    if(!Array.isArray(stuff)){
        throw  new Error('stuff must be array of arrays');
    }

    let registerList = [];
    for(let i = 0; i < stuff.length; i++){
        if(!Array.isArray(stuff[i])){
            throw new Error('stuff must be array of arrays');
        }
        let emitter = stuff[i][0];
        for(let j = 1; j < stuff[i].length; j++){
            let event = stuff[i][j];
            let listener = createListener(emitter, event);
            registerList.push({
                event : event,
                emitter : emitter,
                listener : listener
            });
            emitter.on(event, listener);
        }
    }

    function clean(){
        for(let i = 0, len = registerList.length; i < len; i++){
            let register = registerList[i];
            let emitter = register.emitter;
            emitter.removeListener(register.event, register.listener);
        }
    }

    function createListener(emitter, event){
        return function(){
            clean();
            let args = [].slice.apply(arguments);
            let err = event === 'error' ? args[0] : null;
            if(typeof done === 'function'){
                return done(err, emitter, event, args);
            }
        };
    }

    function thunk(fn){
        done = fn;
    }

    thunk.cancle = clean;
    return thunk;
}
