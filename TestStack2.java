// class TestStack2 {
//     public static void main(String args[]) {
//         Stack mystack1 = new Stack();
//         Stack mystack2 = new Stack();

//         //push some numbers onrt too the stack
//         for(int i = 0; i <10; i++){mystack1.push(i);}
//         for(int i = 10; i < 20; i++){mystack2.push(i);}

//         //pop those numbers off the stack
//         System.out.println("Stack in mystack1:");
//         for(int i = 0; i< 10; i++) {
//             System.out.println(mystack1.pop());
//         }

//         System.out.println("Stack in mystack2:");
//         for(int i = 0; i<10; i++) {
//             System.out.println(mystack2.pop());
//         }

//         //these are not legal
//         // mystack1.tos = -2 
//         // mystack2.stck[3] = 100;
//     }
// }

//Improved Stack class that uses the length array member
class Stack {
    private int stck[];
    private int tos;

    //allocate and initialize stack
    Stack(int size) {
        stck = new int[size];
        tos = -1;
    }

    //Push an item onto the stack
    void push(int item) { 
        if(tos==stck.length-1) { //use length number
            System.out.println("Stack is full.");
        } else {
            stck[++tos] = item;
        }
    }

    //Pop an item from the stack
    int pop() {
        if(tos < 0) {
            System.out.println("Stack underflow.");
            return 0;
        } else {
            return stck[tos--];
        }
    }
}

class TestStack2 {
    public static void main(String args[]) {
        Stack mystack1 = new Stack(5);
        Stack mystack2 = new Stack(8);

        //push some numbers onto the stack
        for (int i=0; i<5; i++) {mystack1.push(i);}
        for (int i=0; i<8; i++) {mystack2.push(i);}

        //pop those numbers off of the stack
        System.out.println("Stack in mystack1:");
        for(int i = 0; i<5; i++){
            System.out.println(mystack1.pop());
        }
        
        System.out.println("Stack in mystack2:");
        for(int i = 0; i<8; i++){
            System.out.println(mystack2.pop());
        }
    }   
}