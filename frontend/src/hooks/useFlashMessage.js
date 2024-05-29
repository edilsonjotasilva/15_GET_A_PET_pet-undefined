import bus from '../utils/bus'

export default function useFlashMessage(){
    function setFlashMessage(msgText, msgType){
        bus.emit('flash',{
            message : msgText,
            type: msgType,
        })
    }

    return {setFlashMessage}
}