class OverloadCons {
    public static void main(String args[]) {
        //create boxes using the various constructors
        Box mybox1 = new Box(10,20,15);
        Box mybox2 = new Box();
        Box mycube = new Box(7);

        double vol;

        //get volume of the first box
        vol = mybox1.volume();
        System.out.println("Volume of mybox1 is " + vol);

        //get volume of the second box
        vol = mybox2.volume();
        System.out.println("Volume of mybox2 is " + vol);

        //get volume of the cube
        vol = mycube.volume();
        System.out.println("Volume of mycube is " + vol);
    }
}

// expected output:
// Volume of mybox1 is 3000.0
// Volume of mybox2 is -1.0
// Volume of mycube is 343.0