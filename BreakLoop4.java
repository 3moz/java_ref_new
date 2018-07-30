//demonstrate using break to exit from nested loops

class BreakLoop4 {
    public static void main(String args[]) {
        //when the inner loop breaks to the outer loop, both loops have been terminated
        //this labels the for statement, which has a block of code as its target.
        outer: for(int i=0; i<3; i++) {
            System.out.print("Pass "+ i + ": ");
            for(int j = 0; j < 100; j++) {
                if(j == 10) break outer; // exit both loops
                System.out.print(j + " ");
            }
            System.out.println("This will not print");
        }
        System.out.println("Loops complete");
    }
}