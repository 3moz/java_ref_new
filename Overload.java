//Demonstrate method overloading
class OverloadDemo {
    void test() {
        System.out.println("No paramaters");
    }
    
    //overload test for one integer parameter
    void test(int a) {
        System.out.println("a: " + a);
    }

    //overload test for two integer parameters
    void test(int a, int b) {
        System.out.println("a and b: " + a + " " + b);
    }

    //overload test for a double parameter
    //returns the double
    double test (double a) {
        System.out.println("double a: "+ a);
        return a*a;
    }
}

class Overload {
    public static void main(String args[]) {
        OverloadDemo ob = new OverloadDemo();
        double result;

        //call each version of test()

        ob.test();
        ob.test(10);
        ob.test(10,20);
        result = ob.test(123.45);
        System.out.println("Result of ob.test(123.45): "+ result);
    }
}

// expected output:
// No paramaters
// a: 10
// a and b: 10 20
// double a: 123.45
// Result of ob.test(123.45): 15239.9025