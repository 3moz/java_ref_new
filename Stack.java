//a class defining an integer stack that can hold 10 values

class Stack {
    int stck[] = new int[10];
    int tos;

    //initialize top-of-stack (tos)
    Stack() {
        tos = -1;
    }

    //push an item onto the stack
    void push(int item) {
        if(tos==9) {
            System.out.println("Stack is full");
        } else {
            stck[++tos] = item;
        }
    }

    //pop an item from teh stack
    int pop() {
        if (tos < 0) {
            System.out.println("Stack underflow");
            return 0;
        } else {
            return stck[tos--];
        }
    }
}