//States attempts (unsuccessfully to create a generic class that can compute
//the average of an array of numbners of any given type

//the class contains a error

// class Stats<T> {
//     T[] nums; //nums is an array of type T

//     //Pass the constructor a reference to an array of type T
//     Stats(T[] o) {
//         nums = o;
//     }

//     //Return type double in all cases
//     double average() {
//         double sum = 0.0;
//         for (int i=0; i < nums.length; i++) {
//             sum += nums[i].duobleValue(); // error
//         }

//         return sum / nums.length;
//     }
// }

//error occurs above because compiler has no way to know you intend to create a States object using only numeric types
//when you attempt to compile, compiler reports that doubleValue() method is unknown even though
//Number (of which Integer and Double are subclasses) defines doubleValue()

//to solve this, Java provides bounded types:

//In this version of States, the type arg for T must be either Number, or a class derived from Number

class Stats<T extends Number> {
    T[] nums; //array of Number or subclass

    //pass constructor a reference to an array of type Nymber or subclass.
    Stats(T[] o) {
        nums = o;
    }

    //Return type double in all cases
    double average() {
        double sum = 0.0;
        for (int i = 0; i < nums.length; i++) {
            sum += nums[i].doubleValue();
        }

        return sum / nums.length;
    }
}

//Demonstrate Stats
class BoundsDemo {
    public static void main(String args[]) {
        Integer inums[] = {1,2,3,4,5};
        Stats<Integer> iob = new Stats<Integer>(inums);
        double v = iob.average();
        System.out.println("iob average is: "+v);

        Double dnums[] = {1.1, 2.2, 3.3, 4.4, 5.5};
        Stats<Double> dob = new Stats<Double>(dnums);
        double w = dob.average();
        System.out.println("dob average is: "+w);

        // // This won't compile becasue String is not a subclass of Number
        // String strs[] = {"1", "2", "3", "4", "5"};
        // Stats<String> strob = new Stats<String>(strs);

        // double x = strob.average();
        // System.out.println("strob average is "+v);
    }
}

// output:
// iob average is: 3.0
// dob average is: 3.3