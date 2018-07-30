// using the break with a label as a civilized form of goto
class Break {
    public static void main(String args[]) {
        boolean t = true;

        //'first', 'second', and 'third' are labelled blocks
        first: {
            second: {
                third: {
                    System.out.println("Before the break");
                    if(t) break second; //break out of the second block
                    System.out.println("This print statement won't execute");
                }
                System.out.println("This print statement won't execute");
            }
            System.out.println("This is after the second block");
        }
    }
}