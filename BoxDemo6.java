class BoxDemo6 {
    public static void main(String args[]) {
        //declare, allocate and initialize Box objects
        Box mybox1 = new Box();
        Box mybox2 = new Box();

        double vol;

        //get volume of the first box
        vol = mybox1.volume();
        System.out.println("Volume is " +vol);

        //get volume of the second box
        vol = mybox2.volume();
        System.out.println("Volume is " +vol);       
    }
}

//output here will be:

/*
Constructing Box
Constructing Box
Volume is 1000.0
Volume is 1000.0
*/

//(assuming initial values for the dimensions were all set to 10 in the Box constructor)