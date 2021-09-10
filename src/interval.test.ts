const { Interval } = require( './Interval' );
const interv1 = new Interval( [ 100 , 200 , 400 , 500 ] , 500 );
test( 'include' , () => expect( interv1.include( 150 ) ).toBe( true ) );
