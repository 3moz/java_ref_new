//demonstrate a for-each style for loop
class ForEach {
    public static void main(String args[]) {
        int nums[] = {1,2,3,4,5,6,7,8,9,10};
        int sum = 0;

        //use for-each style for loop to display and sum the values
        for (int x : nums) {
            System.out.println("Value is: "+ x);
            sum += x;
            
            /*
            if we wanted to stop the loop when 5 is obtained
            if(x==5) break;
            */

        }
        System.out.println("Summation: " + sum);
    }
}