namespace App{
// Drag and drop interface
export interface Dragable{
    dragStarthandler(event:DragEvent):void;
    dragEndhandler(event:DragEvent):void;
    
  }
 export interface Dragtarget{
    dragOverhandler(event:DragEvent):void;
    drophandler(event:DragEvent):void;
    dragLeavehandler(event:DragEvent):void;
  }
}
