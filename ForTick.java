//demonstrate the for loop.
class ForTick {
    public static void main(String args[]) {
        int n;
        //remember the scope of n is the main method here
        for (n=10; n>0; n--) {
            System.out.println("tick "+n);
        }
        
        /* 
        here, the scope of n would be only the for loop.
        in other words, n doesn't exist outside the for loop, and
        if you need to use n elsewhere in the program, you can't declare it inside the for loop
        
        for(int n=10; n>0; n--){
            System.out.println("tick "+n);
        }
        */
    }
}