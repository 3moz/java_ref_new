class Box {
    double width; 
    double height;
    double depth;

    //Here, we use a parameterized constructor to initialize the dimensions of a box.
    //used when all dimensions are specified
    Box(double w, double h, double d) {
        width = w;
        height = h;
        depth = d;
    }
    
    //Here's a constructor for Box
    // Box() {
    //     //the println statement is for illustration purposes
    //     System.out.println("Constructing Box");
    //     width = 10;
    //     height = 10;
    //     depth = 10;
    // }

    //display volume of a box
    // void volume() {
    //     System.out.print("Volume is ");
    //     System.out.println(width * height * depth);
    // }

    //compute and return volume
    double volume() {
        return width * height * depth;
    }

    //sets dimensions of the box
    void setDim( double w, double h, double d) {
        width = w;
        height = h;
        depth = d;
    }

    //below follow other contructors to initialize the dimensions of a box in various ways
    //... demonstrating constructor overloading

    //constructor used when no methods are specified
    Box() {
        //use -1 to indicate an uninitialized box
        width = -1;
        height = -1;
        depth = -1;
    }

    //constructor used when cube is created
    Box(double len) {
        width = height = depth = len;
    }
   
}