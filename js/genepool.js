// === simulation/MathConstants.js ===
//--------------------------------------------------------------------------
//                                                                        
//    This file is part of GenePool Swimbots.                             
//    Copyright (c) 2021 by Jeffrey Ventrella - All Rights Reserved.      
//                                                                        
//    See the README file or go to swimbots.com for full license details.           
//    You may use, distribute, and modify this code only under the terms  
//    of the "Commons Clause" license (commonsclause.com).                
//                                                                        
//    This software is intended for education, game design, and research. 
//                                                                        
// -------------------------------------------------------------------------- 


const INVISIBLE     = false;
const VISIBLE       = true;
const NULL_INDEX    = -1;
const BYTE_SIZE	    = 256;
const ZERO     	    = 0.0;
const ONE_HALF 	    = 0.5;
const ONE		 	= 1.0;
const ONE_THIRD     = ONE / 3.0;
const PI2 		    = Math.PI * 2.0;
const PI_OVER_180   = Math.PI / 180.0;
const MILLISECONDS_PER_SECOND = 1000;



// === simulation/Parameters.js ===
//--------------------------------------------------------------------------
//                                                                        
//    This file is part of GenePool Swimbots.                             
//    Copyright (c) 2021 by Jeffrey Ventrella - All Rights Reserved.      
//                                                                        
//    See the README file or go to swimbots.com for full license details.           
//    You may use, distribute, and modify this code only under the terms  
//    of the "Commons Clause" license (commonsclause.com).                
//                                                                        
//    This software is intended for education, game design, and research. 
//                                                                        
// -------------------------------------------------------------------------- 


// Test 1 of the new two-gene type preference niche.
// Observations: 
// In the first run, all the swimbot races that survived the garden of eden are now all eating the same type of foodbit. Each time a food bit gets eaten it will regenerate to a random type foodbit. Whenever a new food bit spawns as the type that is not prefered by the pool, it basically gets locked away "forever." Thus, over time the pond loses prefered food bits more and more until all the food bits are just one type. This is my hunch, but let's see if this happens. Yes, I think this is a problem. One food type dominates the board when it isn't being eaten quickly enough.
// To keep food bits balanced, what about setting it so that when a yellow food bit is eaten, a yellow food bit is spawned, and same for blue food bits. Currently, if food bit mutation rate is set to zero, then the next food bit will spawn to the more abundant type.

// So far 3 out of 4 pools went extinct. The one pool that survived evolved to "one" apparent species by timestep 2.5mil, where one group ate one group of swimbots ate one type of food type (it's prefered) and did fine, while the other group ate a non-prefered food type (getting only 5 energy points from each food bit). But instead of dying out, this other group is such a good swimmer that it eats all the non-prefered food bits anyway!

// saved simulations: food_niche_1.txt (400 starting pop)
// increasing starting population to 800 and then 1000 to prevent instant extinction...
// Turns out that because of the new food genes, only half of all random swimbots will be able to eat healthfully (food preference matches digestable food type). And since there are two separate types, you divide that number into two since each gets access to only half the food.
// 1600 swimbots would provide 800 viable swimbots (400 for each type). I also increased food to 2000 foodbits--but this didn't work either!

// Going to try setting a larger starting radius so the swimbots and food are more spread out but then with a starting number of 1000 bots and 2000 food bits. Ok, this seems to have worked.. 
// Saved this one as: food_niche_2.txt. It reached almost 40k swimbots but it went extinct eventually. I think because of the food problem. food_niche_3 through 7 are also the same thing.

// Next I will run a series of tests after removing the food niche 2 gene thing by changing the food type offset to 1 (so the food type gene has no effect). All the previous ones had food type offset set to 0.1, meaning a swimbot gets only 10% of the energy from a food bit if it is not adapted to that food type. These new tests are called food_niche_reg_#.txt, beginign with number 1.

// moved back to GenePool.js
//const DEFAULT_MILLISECONDS_PER_UPDATE = 20; // original version
//const DEFAULT_MILLISECONDS_PER_UPDATE = 1;  // research version
  //luka: 1



//this is being slammed to 1 to debug the 2-food type issue...
//const FOOD_TYPE_OFFSET = 1.0;


const FOOD_TYPE_OFFSET = 0.2;

const DEFAULT_NUM_FOOD_TYPES = 1;


//----------------------------------------
//  LOD 
//----------------------------------------
const SWIMBOT_LEVEL_OF_DETAIL_DOT  = 0;
const SWIMBOT_LEVEL_OF_DETAIL_LOW  = 1;
const SWIMBOT_LEVEL_OF_DETAIL_HIGH = 2;

const DEFAULT_GARDEN_OF_EDEN_RADIUS = 2000;
const GARDEN_OF_EDEN_RADIUS = DEFAULT_GARDEN_OF_EDEN_RADIUS;  // original version
//const GARDEN_OF_EDEN_RADIUS = 3000;  // research version 

// I then changed food regeneration period to 15 (from 20) to make it come back even faster to help prevent extinctions (that have been occuring a lot)
// I ran two simulations, both survived: food_niche_3.txt and food_niche_4.txt
const MIN_FOOD_REGENERATION_PERIOD      = 1;
const DEFAULT_FOOD_REGENERATION_PERIOD  = 20;
//const DEFAULT_FOOD_REGENERATION_PERIOD  = 40;
const MAX_FOOD_REGENERATION_PERIOD      = 200;

//const DEFAULT_FOOD_REGENERATION_PERIOD  = 15;  // research version
//luka 15


const DEFAULT_CHILD_ENERGY_RATIO = ONE_HALF;

const MIN_CHILD_ENERGY_RATIO                = ZERO;
const MAX_CHILD_ENERGY_RATIO                = ONE;
const MIN_SWIMBOT_HUNGER_THRESHOLD          = ZERO;


const MAX_SWIMBOTS = 2000;

const INITIAL_NUM_SWIMBOTS =  500; // original version
//const INITIAL_NUM_SWIMBOTS = 1000; // research version
//luka 1000

const MAX_FOODBITS           = 2000;
const MAX_FOODBITS_PER_TYPE  = 1000; // make this one-half of MAX_FOODBITS (because there are two types)
const INITIAL_NUM_FOODBITS   = 1000; // original version
//const INITIAL_NUM_FOODBITS = 2000; // research version

const NON_REPRODUCING_JUNK_DNA_LIMIT    = 0.9; 
//0.9 appears to be a good threshold for species differences. Any less and it takes way too long
// for species to separate out and any more and the species appear the same to the user.

const SPAWN_FOOD_RANDOMLY_IN_POOL = false;

const MUTATION_RATE = 0.01;

//const CROSSOVER_RATE = 0.01;  // original version
const CROSSOVER_RATE = 0.2;     // I just decided to make this bigger (sept.3.2021) but I should check that it's ok.
//const CROSSOVER_RATE = 0.5;   // research version

//for the videos: luka set FOOD_BIT_SIZE = 1.5

const MAX_SWIMBOT_HUNGER_THRESHOLD      = 200;
const DEFAULT_SWIMBOT_HUNGER_THRESHOLD	=  50;

//const FOOD_TYPE_MUTATION_RATE = 0.99; // essentially 1: makes it so newborn foodbits can be either type


// FOOD_TYPE_OFFSET is the proportion of energy a swimbot gets from food if 
// it is not its prefered food source. So if swimbots usually get 50 energy points, 
// a swimbot that does not have the right digestion (gene values) for that type
// of food will only get 35 energy points if the FOOD_TYPE_OFFSET is set to 0.7

const YOUNG_AGE_DURATION    = 1000;
const OLD_AGE_DURATION      = 1000;
const MIN_MAXIMUM_AGE       = YOUNG_AGE_DURATION + OLD_AGE_DURATION;
const MAX_MAXIMUM_AGE       = 40000;

const DEFAULT_MAXIMUM_AGE   = MAX_MAXIMUM_AGE;

//const MAXIMUM_LIFESPAN   = 15000; // research version //luka

//const OLD_AGE = MAXIMUM_LIFESPAN - OLD_AGE_DURATION;

const SWIMBOT_SELECT_RADIUS_SCALAR  = 7.0;


const RENDER_SWIMBOT_AS_DOT     = false;
const SWIMBOT_DOT_RENDER_RADIUS = 20;

// Line 348 of Genotype.js I've modified to:
// let amplitude = Math.floor( Math.random() * Math.random() * Math.random() * BYTE_SIZE );
// Math.random() is cubed instead of squared. This makes the mutation amplitude lower
// so that mutations don't appear totally random.

// Also changed line 726 of the saveload.js file to:
// for (let n=0; n<familyTree.getNumNodes(); n += 5) 
// so that the family tree only saves every fifth swimbot instead of all of them.
// This "random" subset of swimbots is all it takes to get enough data for meaningful
// analyses and evolutionary trees without slowing down Gene Pool to a stand-still.


//---------------------------------------------------------------------------
// I'm trying something new here: these are global variables that are 
// meant to be adjustible via the ui (and maybe via other components).
//---------------------------------------------------------------------------
function GlobalTweakers()
{
    this.childEnergyRatio       = DEFAULT_CHILD_ENERGY_RATIO;
    this.maximumLifeSpan        = DEFAULT_MAXIMUM_AGE;
	this.foodSpread             = DEFAULT_FOOD_BIT_MAX_SPAWN_RADIUS;
	this.foodBitEnergy          = DEFAULT_FOOD_BIT_ENERGY;
	this.foodRegenerationPeriod = DEFAULT_FOOD_REGENERATION_PERIOD;
	this.hungerThreshold        = DEFAULT_SWIMBOT_HUNGER_THRESHOLD;
	this.numFoodTypes           = DEFAULT_NUM_FOOD_TYPES;
	this.attractionCriterion    = ATTRACTION_SIMILAR_COLOR;
}







// === simulation/Utility.js ===
//--------------------------------------------------------------------------
//                                                                        
//    This file is part of GenePool Swimbots.                             
//    Copyright (c) 2021 by Jeffrey Ventrella - All Rights Reserved.      
//                                                                        
//    See the README file or go to swimbots.com for full license details.           
//    You may use, distribute, and modify this code only under the terms  
//    of the "Commons Clause" license (commonsclause.com).                
//                                                                        
//    This software is intended for education, game design, and research. 
//                                                                        
// -------------------------------------------------------------------------- 



	//-----------------------------------
	// color
	//-----------------------------------
    function Color()
    {
        this.red   = ZERO;
        this.green = ZERO;
        this.blue  = ZERO;
    }

	//-----------------------------------
	// assert
	//-----------------------------------
	function assert( assertion, string )
	{
		if ( !assertion )
		{
			alert( "assertion failed: " + string );
		} 
	}


	//-----------------------------------
	// assert integer
	//-----------------------------------
	function assertInteger( value, string )
	{
		if ( value - Math.floor( value ) > 0 )
		{
			alert( "assertInteger: value not an integer! - " + string );
		} 
	}
	
	//-----------------------------------
	// getRandomAngleInDegrees
	//-----------------------------------
	function getRandomAngleInDegrees()
	{
		return -180.0 + Math.random() * 360.0;
	}
	


// === simulation/Vector2D.js ===
//--------------------------------------------------------------------------
//                                                                        
//    This file is part of GenePool Swimbots.                             
//    Copyright (c) 2021 by Jeffrey Ventrella - All Rights Reserved.      
//                                                                        
//    See the README file or go to swimbots.com for full license details.           
//    You may use, distribute, and modify this code only under the terms  
//    of the "Commons Clause" license (commonsclause.com).                
//                                                                        
//    This software is intended for education, game design, and research. 
//                                                                        
// -------------------------------------------------------------------------- 

"use strict";

function Vector2D()
{	
	this.x = 0.0;
	this.y = 0.0;


	//----------------------------------
	this.setXY = function( x_, y_ )
	{	
		this.x = x_;
		this.y = y_;
	}


	//--------------------------
	this.copyFrom = function(v)
	{	
		this.x = v.x;
		this.y = v.y;
	}


	//--------------------------------------
	this.addXY  = function( x_, y_ )
	{
		this.x += x_;
		this.y += y_;	
	}
	
	
	//-----------------------
	this.set = function( p_ )
	{
		this.x = p_.x;
		this.y = p_.y;
	}
	
	
	
	/*
	//---------------------------------
	this.setToSum = function( v1, v2 )
	{
		x = v1.getX() + v2.getX();
		y = v1.getY() + v2.getY();
	} 
	*/

	//----------------------------------------
	this.setToDifference = function( v1, v2 )
	{
		this.x = v1.x - v2.x;
		this.y = v1.y - v2.y;		
	} 


	/*
	//-------------------------------------
	this.setToAverage = function( v1, v2 )
	{
		x = ( v1.getX() + v2.getX() ) * 0.5;
		y = ( v1.getY() + v2.getY() ) * 0.5;	
	}
	*/


	//-------------------------------------------------------------------------------------------
	this.normalize = function()
	{
		let m = Math.sqrt( this.x * this.x + this.y * this.y );
		
		if ( m > 0 )
		{
			this.x /= m;
			this.y /= m;
		}
		else
		{
			this.x = 1.0;
			this.y = 0.0;
		}
	} 


	
	//------------------------
	this.add = function( v )
	{
		this.x += v.x;
		this.y += v.y;
		
	} 

	
	//---------------------------- 
	this.subtract = function( v )
	{
		this.x -= v.x;
		this.y -= v.y;	
	}
	
	//-----------------------------------
	this.getMagnitude = function()
	{
		return Math.sqrt( this.x * this.x + this.y * this.y );
	}

	//-----------------------------------
	this.getMagnitudeSquared = function()
	{
		return this.x * this.x + this.y * this.y;
	}

	//-----------------------
	this.clear = function()
	{
		this.x = 0.0;
		this.y = 0.0;
	}
	
	//-------------------------
	this.scale = function( s )
	{
		this.x *= s;
		this.y *= s;
	}
	
	
	//----------------------------------------------
	this.addScaled = function( vectorToAdd, scale ) 
	{ 
		this.x += vectorToAdd.x * scale; 
		this.y += vectorToAdd.y * scale; 
	}
	
	//----------------------------------------------------------
	this.subtractScaled = function( vectorToSubtract, scale ) 
	{ 
		this.x -= vectorToSubtract.x * scale; 
		this.y -= vectorToSubtract.y * scale; 
	}


	//--------------------------
	this.dotWith = function( v )
	{
		return this.x * v.x + this.y * v.y;		
	} 
	
	

	//-----------------------------------------------------------
	this.setToRandomLocationInDisk = function( position, radius )
	{
		let radian = PI2 * Math.random();
		let magnitude = radius * Math.sqrt( Math.random() );

        this.x = position.x + Math.sin( radian ) * magnitude;
        this.y = position.y + Math.cos( radian ) * magnitude;
	}
	
	//-----------------------------------------------
    this.getDistanceSquaredTo = function( position )
    {
        let xx = this.x - position.x;
        let yy = this.y - position.y;
        return xx * xx + yy * yy;
    }


	//-----------------------------------------
    this.getDistanceTo = function( position )
    {
        let xx = this.x - position.x;
        let yy = this.y - position.y;
        return Math.sqrt( xx * xx + yy * yy );
    }


	//------------------------------------
    this.setToPerpendicular = function()
    {
        let px =  this.y;
        let py = -this.x;
        
        this.x = px;
        this.y = py;        
    }



	//----------------------------------------------------
	// check to see if segment a crosses segment b
	//----------------------------------------------------
    this.getSegmentsCrossing = function( a0, a1, b0, b1 )
    {
        //----------------------------
        // get the a and b vectors
        //----------------------------
        let aX = a1.x - a0.x;
        let aY = a1.y - a0.y;

        let bX = b1.x - b0.x;
        let bY = b1.y - b0.y;

        //----------------------------
        // get their perpendiculars
        //----------------------------
        let aPerpX = -aY;
        let aPerpY =  aX;

        let bPerpX = -bY;
        let bPerpY =  bX;
        
        //--------------------------------
        // get the vector from a0 to b0
        //--------------------------------
        let a0b0x = b0.x - a0.x;
        let a0b0y = b0.y - a0.y;

        //--------------------------------
        // get the vector from a0 to b1
        //--------------------------------
        let a0b1x = b1.x - a0.x;
        let a0b1y = b1.y - a0.y;

        //--------------------------------
        // get the vector from b0 to a0
        //--------------------------------
        let b0a0x = a0.x - b0.x;
        let b0a0y = a0.y - b0.y;
        
        //--------------------------------
        // get the vector from b0 to a1
        //--------------------------------
        let b0a1x = a1.x - b0.x;
        let b0a1y = a1.y - b0.y;
        
        //-------------------------------------------------------
        // get the dots of aPerp to the vectors to b0 and b1
        //-------------------------------------------------------
        let a0Dotb0 = aPerpX * a0b0x + aPerpY * a0b0y;
        let a0Dotb1 = aPerpX * a0b1x + aPerpY * a0b1y;

        //-------------------------------------------------------
        // get the dots of bPerp to the vectors to a0 and a1
        //-------------------------------------------------------
        let b0Dota0 = bPerpX * b0a0x + bPerpY * b0a0y;
        let b0Dota1 = bPerpX * b0a1x + bPerpY * b0a1y;
            
        //----------------------------------------------
        // if both pairs of dots are on opoosite 
        // sides of zero, then the lines are crossing.
        //----------------------------------------------
        if (((( a0Dotb0 > ZERO ) && ( a0Dotb1 < ZERO ))
        ||   (( a0Dotb1 > ZERO ) && ( a0Dotb0 < ZERO )))
        &&  ((( b0Dota0 > ZERO ) && ( b0Dota1 < ZERO ))
        ||   (( b0Dota1 > ZERO ) && ( b0Dota0 < ZERO ))))
        {
            return true;
        }
    
        return false;
    }




    /*
	//-------------------------------------------------------------------
    this.getClosestPointOnLineSegment = function( segmentEnd1, segmentEnd2 )
    {        
        let position = new Vector2D();
        position.setXY( x, y );
        
        let vectorFromEnd1ToPosition = new Vector2D();        
        vectorFromEnd1ToPosition.set( position );
        vectorFromEnd1ToPosition.subtract( segmentEnd1 );

        let segmentVector = new Vector2D();        
        segmentVector.set( segmentEnd2 );
        segmentVector.subtract( segmentEnd1 );
        
        let dot = vectorFromEnd1ToPosition.dotWith( segmentVector );
        if ( dot < 0.0 )
        {
            return segmentEnd1;
        }
        
        let squared = segmentVector.dotWith( segmentVector );
        if ( dot > squared )
        {
            return segmentEnd2;
        }
        
        let extent = dot / squared;

        let positionOnSegment = new Vector2D();
        positionOnSegment.set( segmentEnd1 );
        positionOnSegment.addScaled( segmentVector, extent );
        
        let vectorFromPositionToPositionOnSegment = new Vector2D();
        
        vectorFromPositionToPositionOnSegment.set( positionOnSegment );
        vectorFromPositionToPositionOnSegment.subtract( position );

        return positionOnSegment;
    }
	*/

	
	
/*
	//-------------------------------------------------------------------
    this.getDistanceToLineSegment = function( segmentEnd1, segmentEnd2 )
    {        
        //console.log( "position = " + x + ", " + y );

        //console.log( "segmentEnd1 = " + segmentEnd1.getX() + ", " +  segmentEnd1.getY() );
        //console.log( "segmentEnd2 = " + segmentEnd2.getX() + ", " +  segmentEnd2.getY() );
    
        let position = new Vector2D();
        position.setXY( x, y );
        
        let vectorFromEnd1ToPosition = new Vector2D();        
        vectorFromEnd1ToPosition.set( position );
        vectorFromEnd1ToPosition.subtract( segmentEnd1 );

        let segmentVector = new Vector2D();        
        segmentVector.set( segmentEnd2 );
        segmentVector.subtract( segmentEnd1 );

        //console.log( "segmentVector = " + segmentVector.getX() + ", " +  segmentVector.getY() );
        
        let dot = vectorFromEnd1ToPosition.dotWith( segmentVector );
        //console.log( "dot = " + dot );
        if ( dot < 0.0 )
        {
            //console.log( "dot is < 0" );
            let distance = vectorFromEnd1ToPosition.getMagnitude();
            return distance;
        }
        
        let squared = segmentVector.dotWith( segmentVector );
        //console.log( "segmentVector squared = " + squared ); 
        if ( dot > squared )
        {
            //console.log( "dot is > segmentVector squared" );
            let vectorFromEnd2ToPosition = new Vector2D();        
            vectorFromEnd2ToPosition.set( position );
            vectorFromEnd2ToPosition.subtract( segmentEnd2 );
            let distance = vectorFromEnd2ToPosition.getMagnitude();
            return distance;
        }
        
        //console.log( "dot is > 0.0 and < segmentVector squared " ); 
        
        let extent = dot / squared;

        //console.log( "extent = " + extent ); 

        let positionOnSegment = new Vector2D();
        positionOnSegment.set( segmentEnd1 );
        positionOnSegment.addScaled( segmentVector, extent );
        
        let vectorFromPositionToPositionOnSegment = new Vector2D();
        
        vectorFromPositionToPositionOnSegment.set( positionOnSegment );
        vectorFromPositionToPositionOnSegment.subtract( position );
        
        let distance = vectorFromPositionToPositionOnSegment.getMagnitude();
        return distance;
    }
*/

} //---------------------------------------------------------------------------------
 //---------------  END of class constructor ---------------------------------------
//---------------------------------------------------------------------------------






// === simulation/Pool.js ===
//--------------------------------------------------------------------------
//                                                                        
//    This file is part of GenePool Swimbots.                             
//    Copyright (c) 2021 by Jeffrey Ventrella - All Rights Reserved.      
//                                                                        
//    See the README file or go to swimbots.com for full license details.           
//    You may use, distribute, and modify this code only under the terms  
//    of the "Commons Clause" license (commonsclause.com).                
//                                                                        
//    This software is intended for education, game design, and research. 
//                                                                        
// -------------------------------------------------------------------------- 

"use strict";

//-------------------------------------
// metrics
//-------------------------------------
const POOL_LEFT     = ZERO;
const POOL_RIGHT    = 8000.0;
const POOL_TOP      = ZERO;
const POOL_BOTTOM   = 8000.0;

const POOL_WIDTH  = ( POOL_RIGHT  - POOL_LEFT );
const POOL_HEIGHT = ( POOL_BOTTOM - POOL_TOP  );

const POOL_X_CENTER = POOL_LEFT + POOL_WIDTH    * ONE_HALF;
const POOL_Y_CENTER = POOL_TOP  + POOL_HEIGHT   * ONE_HALF;

//--------------------------------------------------
// pool
//--------------------------------------------------
function Pool()
{    
//const POOL_COLOR                = "rgba( 60, 73, 80, 0.8 )";
const POOL_COLOR                = "rgba( 50, 63, 80, 1.0 )";

    const BOUNDARY_MARGIN_COLOR     = "rgb(  0,  0,  0 )";
    const EFFECT_COLOR 	            = "220, 240, 255";

//const POOL_BOUNDARY_MARGIN      = 300.0;
const POOL_BOUNDARY_MARGIN      = 1200.0;

    const TOUCH_RIPPLE_DURATION	    = 0.3;
    const MAX_TOUCH_RIPPLE_RADIUS   = 0.04;
    const NUM_EFFECT_BLOBS          = 20;
    const EFFECT_BLOB_COLOR         = "70, 80, 90";
    const EFFECT_BLOB_DURATION      = 8.0;
    const EFFECT_BLOB_PERIOD        = 20;
    const EFFECT_BLOB_ALPHA         = 0.5;

	function Touch()
	{	
		this.down		= false;
		this.moving		= false;
		this.position	= new Vector2D();
		this.time 		= ZERO;
		this.radius		= ZERO;
	}

    function EffectBlob()
    {
        let startTime = ZERO;
        let xPosition = ZERO;    
        let yPosition = ZERO;    
        let radius    = ZERO;    
     }

	let _touch = new Touch();
	let _center = new Vector2D();
	let _currentEffectBlob = 0;
	let _effectClock = 0;
	let _effectBlob = new Array( NUM_EFFECT_BLOBS );
	
	//----------------------------------
	// do this now
	//----------------------------------
    _center.x = POOL_LEFT + POOL_WIDTH  * ONE_HALF;
    _center.y = POOL_TOP  + POOL_HEIGHT * ONE_HALF;
        
	//----------------------------------
	// initialize
	//----------------------------------
	this.initialize = function( t )
	{
    	_touch.time = t;
    	
    	for (let b=0; b<NUM_EFFECT_BLOBS; b++)
    	{
    	    _effectBlob[b] = new EffectBlob();
    	}

        //console.log( "pool initialize: " + _center.x + ", " + _center.y );            
    }
    
	//----------------------------------------
	// start touch
	//----------------------------------------
	this.startTouch = function( position, time )
	{
		_touch.down 		= true;
		_touch.position.x	= position.x;
		_touch.position.y 	= position.y;
		_touch.time 		= time;
	}

	//--------------------------------------
	// move touch
	//--------------------------------------
	this.moveTouch = function( position, time )
	{
		if ( _touch.down ) 
		{
			_touch.position.x = position.x;
			_touch.position.y = position.y;
		}
	}

	//--------------------------------------
	// end touch
	//--------------------------------------
	this.endTouch = function( position, time )
	{
		_touch.down 		= false;
		_touch.position.x 	= position.x;
		_touch.position.y 	= position.y;
		_touch.time 		= time;
	}

	//---------------------------
	// get center
	//---------------------------
	this.getCenter = function()
	{
        //console.log( "getCenter: " + _center.x + ", " + _center.y );            
	
		return _center;
	}

	//------------------------------------------------
	// render
	//------------------------------------------------
	this.render = function( _seconds, viewport )
	{
		//------------------------------
		// show pool background
		//------------------------------
        let lineWidth = 0.005 + 0.001 * viewport.getScale(); 	

        canvas.fillStyle = POOL_COLOR;		
        canvas.fillRect( POOL_LEFT, POOL_TOP, POOL_WIDTH, POOL_HEIGHT );

        // use this instead of the above to include an image as the background...
        //canvas.clearRect( POOL_LEFT, POOL_TOP, POOL_WIDTH, POOL_HEIGHT );

		//------------------------------------------------------------
		// show touch
		//------------------------------------------------------------
		if ( ( _seconds - _touch.time ) < TOUCH_RIPPLE_DURATION )
		{
			let f = ( _seconds - _touch.time ) / TOUCH_RIPPLE_DURATION;

			if ( _touch.down )
			{
				_touch.radius = MAX_TOUCH_RIPPLE_RADIUS * ( ONE - f );
			}
			else
			{
				_touch.radius = MAX_TOUCH_RIPPLE_RADIUS * f;
			}

            let radius = _touch.radius * viewport.getScale();
            //assert( radius >= ZERO, "Pool.js: render: radius >= ZERO" );

            if ( radius > ZERO )
            {
                let alpha = ONE - _touch.radius / MAX_TOUCH_RIPPLE_RADIUS;
            
                canvas.lineWidth = lineWidth;
                canvas.strokeStyle = "rgba( " + EFFECT_COLOR + ", " + alpha + " )";	
                canvas.beginPath();
                canvas.arc( _touch.position.x, _touch.position.y, radius, 0, PI2, false );
                canvas.stroke();
                canvas.closePath();	
			}
		}

		//----------------
		// reset this!
		//----------------
		_touch.moving = false;
		
		//------------------------------------------
		// show watery effects
		//------------------------------------------
		//showWateryEffects( _seconds, viewport );
		
		//------------------
		// show boundary
		//------------------
		canvas.fillStyle = BOUNDARY_MARGIN_COLOR;	
		canvas.fillRect( POOL_LEFT,                         POOL_TOP - POOL_BOUNDARY_MARGIN,    POOL_WIDTH,             POOL_BOUNDARY_MARGIN    );
		canvas.fillRect( POOL_LEFT,                         POOL_BOTTOM,                        POOL_WIDTH,             POOL_BOUNDARY_MARGIN    );
		canvas.fillRect( POOL_LEFT - POOL_BOUNDARY_MARGIN,  POOL_TOP,                           POOL_BOUNDARY_MARGIN,   POOL_HEIGHT             );
		canvas.fillRect( POOL_RIGHT,                        POOL_TOP,                           POOL_BOUNDARY_MARGIN,   POOL_HEIGHT             );
	}
	


	//---------------------------------------------
    function showWateryEffects( seconds, viewport )
    {        
        let v = viewport.getScale() * 0.3;
        _effectClock ++;

        let viewCenterX = 4000;
        let viewCenterY = 4000;
    
        if ( _effectClock % EFFECT_BLOB_PERIOD === 0 )
        {
            _currentEffectBlob ++;
            if ( _currentEffectBlob >= NUM_EFFECT_BLOBS )
            {
                _currentEffectBlob = 0;
            }
            
            _effectBlob[ _currentEffectBlob ].startTime = seconds;
            _effectBlob[ _currentEffectBlob ].radius = v;
            
            //_effectBlob[ _currentEffectBlob ].xPosition = viewport.getPosition().x - v + v * 2 * Math.random(); 
            //_effectBlob[ _currentEffectBlob ].yPosition = viewport.getPosition().y - v + v * 2 * Math.random();    

            _effectBlob[ _currentEffectBlob ].xPosition = viewport.getPosition().x + v * Math.sin( _effectClock * 0.040 ); 
            _effectBlob[ _currentEffectBlob ].yPosition = viewport.getPosition().y + v * Math.sin( _effectClock * 0.080 ); 
        }

        canvas.lineWidth = 3;
        
    	for (let b=0; b<NUM_EFFECT_BLOBS; b++)
    	{
    	    let timePassed = seconds - _effectBlob[b].startTime;
    	    
    	    if ( timePassed < EFFECT_BLOB_DURATION )
    	    {    	
    	        let fraction = timePassed / EFFECT_BLOB_DURATION;
    	        let wave = ONE_HALF - ONE_HALF * Math.cos( fraction * PI2 );
    	        //let radius   = _effectBlob[b].radius * 0.3 + wave * _effectBlob[b].radius;
    	        let radius   = _effectBlob[b].radius * 0.3 + fraction * _effectBlob[b].radius;
    	        let alpha    = wave * EFFECT_BLOB_ALPHA;    	        
    	        
                canvas.strokeStyle = "rgba( " + EFFECT_BLOB_COLOR + ", " + alpha + " )";	
                canvas.fillStyle   = "rgba( " + EFFECT_BLOB_COLOR + ", " + alpha + " )";	
                canvas.beginPath();
//canvas.arc( _effectBlob[b].xPosition, _effectBlob[b].yPosition, radius, 0, PI2, false );
canvas.ellipse( _effectBlob[b].xPosition, _effectBlob[b].yPosition, radius, radius * 0.5, 0.0, 0, PI2, false );                
                
                //canvas.stroke();
                canvas.fill();
                canvas.closePath();	 
            }
    	}
    }
}







// === simulation/Camera.js ===
//--------------------------------------------------------------------------
//                                                                        
//    This file is part of GenePool Swimbots.                             
//    Copyright (c) 2021 by Jeffrey Ventrella - All Rights Reserved.      
//                                                                        
//    See the README file or go to swimbots.com for full license details.           
//    You may use, distribute, and modify this code only under the terms  
//    of the "Commons Clause" license (commonsclause.com).                
//                                                                        
//    This software is intended for education, game design, and research. 
//                                                                        
// -------------------------------------------------------------------------- 

"use strict";


//------------------------------------------
function Camera()
{
    const FRICTION   			=  8.0;
	const BUTTON_FORCE          =  0.3;
	const DRAG_FORCE            =  0.03;
    const PAN_OVERSHOOT_PUSH 	=  0.7;
    const SCALE_OVERSHOOT_PUSH	=  0.7;
    const MINIMUM_SCALE 		=  500.0;
    
	//------------------------------------------
	// members
	//------------------------------------------
	let _position  		    = new Vector2D();
	let _velocity  		    = new Vector2D();
	let _vectorUtility      = new Vector2D();
	let _scaleDelta 	    = ZERO;
	let _scale      	    = ONE;
    let _aspectRatio        = ONE;
	let _left	    	    = ZERO;
	let _right	    	    = ZERO;
	let _top	    	    = ZERO;
	let _bottom	    	    = ZERO;
	let _seconds		    = ZERO;
	let _secondsDelta	    = ZERO;
	
	//--------------------------------
	this.update = function( seconds )
	{		
        //-------------------------------------------
        // friction
        //-------------------------------------------
        let f = ONE - FRICTION  * _secondsDelta;

        if ( f < ZERO )
        {
            _velocity.clear();
            _scaleDelta = ZERO;				
        }
        else if ( f < ONE )
        {
            _velocity.scale(f);
            _scaleDelta *= (f);
        }

        //-----------------------------
        // update position and scale
        //-----------------------------
        _position.add( _velocity );
        _scale += _scaleDelta;

        //----------------------
        // calculate frame
        //----------------------
        calculateFrame();

        //----------------------
        // apply constraints
        //----------------------
        applyConstraints();

		//-----------------------------------
		// update seconds
		//-----------------------------------
		_secondsDelta = seconds - _seconds;
		_seconds = seconds;
	}



	//----------------------------------------------
	this.addForce = function( force, scaleForce )
	{
        _velocity.x = force.x;
        _velocity.y = force.y;
        
        _scaleDelta = scaleForce;
    }
	

	//--------------------------------------
	this.setAspectRatio = function(a)
	{	
        //console.log( "setAspectRatio" );
	
	    _aspectRatio = a;

        //---------------------
        // important
        //---------------------
        calculateFrame();
        
        //---------------------
        // apply constraints
        //---------------------
        applyConstraints();        
	}

	//-------------------------
	function calculateFrame()
	{	
        _right  = _position.x + _scale * ONE_HALF * _aspectRatio;
        _left   = _position.x - _scale * ONE_HALF * _aspectRatio;

		_top    = _position.y + _scale * ONE_HALF;
		_bottom	= _position.y - _scale * ONE_HALF;
	}


	//--------------------------
	function applyConstraints()
	{	
        let scaleOvershoot = _scale - ( POOL_RIGHT - POOL_LEFT );
        if ( scaleOvershoot > ZERO )
        {
            _scale -= scaleOvershoot * SCALE_OVERSHOOT_PUSH;
        }

        let scaleUndershoot = _scale - MINIMUM_SCALE;
        if ( scaleUndershoot < ZERO )
        {
            _scale -= scaleUndershoot * SCALE_OVERSHOOT_PUSH;
        }

        let rightOverShoot  = _right  - POOL_RIGHT;
        let leftOverShoot   = _left   + POOL_LEFT;
        let topOverShoot    = _top    - POOL_BOTTOM;
        let bottomOverShoot = _bottom + POOL_TOP;

        if ( rightOverShoot > ZERO  )
        {
            _position.x -= rightOverShoot * PAN_OVERSHOOT_PUSH; 
            calculateFrame();
        }
        if ( leftOverShoot < ZERO  )
        {
            _position.x -= leftOverShoot * PAN_OVERSHOOT_PUSH; 
            calculateFrame();
        }

        if ( topOverShoot > ZERO  )
        {
            _position.y -= topOverShoot * PAN_OVERSHOOT_PUSH; 
            calculateFrame();
        }
        if ( bottomOverShoot < ZERO  )
        {
            _position.y -= bottomOverShoot * PAN_OVERSHOOT_PUSH; 
            calculateFrame();
        }
	}

	//----------------------------------------------------------------------------------------
	// controls
	//----------------------------------------------------------------------------------------
	this.panLeft    = function() { _velocity.x -= _scale * BUTTON_FORCE * _secondsDelta; }
	this.panRight   = function() { _velocity.x += _scale * BUTTON_FORCE * _secondsDelta; }
	this.panDown    = function() { _velocity.y += _scale * BUTTON_FORCE * _secondsDelta; }
	this.panUp      = function() { _velocity.y -= _scale * BUTTON_FORCE * _secondsDelta; }
	this.zoomIn     = function() { _scaleDelta -= _scale * BUTTON_FORCE * _secondsDelta; }
	this.zoomOut    = function() { _scaleDelta += _scale * BUTTON_FORCE * _secondsDelta; }

	//----------------------------
	this.drag = function( x, y )
	{	
		_velocity.x -= x * _scale * DRAG_FORCE * _secondsDelta;
		_velocity.y -= y * _scale * DRAG_FORCE * _secondsDelta;
		
		//---------------------------------------------------------------
		// as the scale approaches the whole pool, the drag gets 
		// more dampened, until it is fully dampened at the limit.
		//---------------------------------------------------------------
		let limit = POOL_WIDTH * 0.4;

		if ( _scale > limit )
		{
		    if ( _scale > POOL_WIDTH )
		      {
		          _scale = POOL_WIDTH;
		      }
		      let dampening = ONE - ( ( _scale - limit ) / ( POOL_WIDTH - limit ) );
			
			
		
		    	_velocity.x *= dampening;
		    _velocity.y *= dampening;
		}
    }
    
    
	//--------------------------------------
	this.setPosition = function( position )
	{	
		_position.copyFrom( position );
		_velocity.clear();

        //---------------------
        // important
        //---------------------
        calculateFrame();
	}

	//---------------------------------
	this.setScale = function( scale )
	{	
		_scale = scale;
		_scaleDelta = ZERO;

        //---------------------
        // important
        //---------------------
        calculateFrame();
	}
	
	//-------------------------------------
	this.setScaleToMax = function()
	{	
		_scale = POOL_RIGHT - POOL_LEFT;
	    _scaleDelta = ZERO;
        _position.setXY( POOL_LEFT + _scale * ONE_HALF, POOL_TOP + _scale * ONE_HALF );
	    _velocity.clear()

        //---------------------
        // important
        //---------------------
        calculateFrame();
	}

	//---------------------------
	this.getPosition = function()
	{	
	    _vectorUtility.x = _position.x;
	    _vectorUtility.y = _position.y;
	
		return _vectorUtility;
	}	

	//---------------------------
	this.getScale = function()
	{	
        return _scale;
	}
	
	//---------------------------
	this.getXDimension = function()
	{	
        return _scale * _aspectRatio;
	}
	
	//---------------------------
	this.getYDimension = function()
	{	
		return _scale;
	}

	//------------------------------------------------
	this.getWithinView = function( position, buffer )
	{
		if (( position.x < _right  + buffer )
		&&  ( position.x > _left   - buffer )
		&&  ( position.y < _top    + buffer )
		&&  ( position.y > _bottom - buffer ))
		{
			return true;
		}

		return false;
	}
	
}


// === simulation/FoodBit.js ===
//--------------------------------------------------------------------------
//                                                                        
//    This file is part of GenePool Swimbots.                             
//    Copyright (c) 2021 by Jeffrey Ventrella - All Rights Reserved.      
//                                                                        
//    See the README file or go to swimbots.com for full license details.           
//    You may use, distribute, and modify this code only under the terms  
//    of the "Commons Clause" license (commonsclause.com).                
//                                                                        
//    This software is intended for education, game design, and research. 
//                                                                        
// -------------------------------------------------------------------------- 

"use strict";


const FOOD_BIT_SIZE                     = 1.5; //default size
const MIN_FOOD_BIT_MAX_SPAWN_RADIUS     = 10;
const MAX_FOOD_BIT_MAX_SPAWN_RADIUS     = 4000.0;
const DEFAULT_FOOD_BIT_MAX_SPAWN_RADIUS = 4000.0; //max distance for spawned child
const MIN_FOOD_BIT_ENERGY               = 0.0; 
const MAX_FOOD_BIT_ENERGY               = 100.0; 
const DEFAULT_FOOD_BIT_ENERGY           = 50.0;  //when eaten, swimbot gets this much energy
const FOOD_BIT_SIZE_VIEW_SCALE          = 0.03; //increase with view scale (a kind of LOD)
const FOOD_BIT_GRAB_RADIUS              = 20.0;  // radius for grabbing food bit
const FOOD_BIT_BOUNDARY_MARGIN          = POOL_WIDTH * 0.01; // important value - creates empty space from wall
const FOOD_BIT_COLOR_COMPONENTS         = "100, 200, 100";	
const FOOD_BIT_ROLLOVER_COLOR           = "rgba( 100, 200, 100, 0.5 )";	
const FOOD_BIT_SELECT_COLOR             = "rgba( 200, 200, 200, 1.0 )";	
const FOOD_OPACITY_INCREMENT            = 0.01;

//const FOOD_TYPE_NULL   = -1;
//const FOOD_TYPE_GREEN  =  0;
//const FOOD_TYPE_BLUE   =  1;

//------------------------
// Food bit
//------------------------
function FoodBit()
{
    let _position       = new Vector2D();
    let _energy         = ZERO;
    let _type           = 0;
    let _red            = ZERO;
    let _green          = ZERO;
    let _blue           = ZERO;
    let _opacity        = ZERO;
    let _index          = NULL_INDEX;
    let _maxSpawnRadius = DEFAULT_FOOD_BIT_MAX_SPAWN_RADIUS;

    //--------------------------------------------------------
    // initialize
    //--------------------------------------------------------
	this.initialize = function(f)
	{
        _index      = f;
        _energy     = DEFAULT_FOOD_BIT_ENERGY;  
        _opacity    = ZERO;
        _position.x = POOL_LEFT + Math.random() * POOL_WIDTH;
        _position.y = POOL_TOP  + Math.random() * POOL_HEIGHT;
        _type       = 0;
    }


    /*
    //--------------------------------------
	this.randomizeType = function()
	{
	    //console.log( "randomizeType" ) ;
	    
	    _type = Math.floor( Math.random() * 2 );
	    
        this.setColorAccordingToType();
	}
	*/

    //--------------------------------------
	this.setType = function(n)
	{
//assert ( ( n === 0 ) || ( n === 1 ), "Foodbit.js: setType: ( n === 0 ) || ( n === 1 )" );
	    
	    _type = n;
	    
        this.setColorAccordingToType();
	}

    /*
    //-------------------------------------------------
	this.setTypeAccordingToPosition = function()
	{
        _type1 = ( _position.x - POOL_LEFT ) / POOL_WIDTH;
        _type2 = ( _position.y - POOL_TOP  ) / POOL_HEIGHT;
         
        assert( _type1 >  ZERO, "foodbit.js: _type1 >  ZERO" );
        assert( _type2 >  ZERO, "foodbit.js: _type2 >  ZERO" );        
        assert( _type1 <= ONE,  "foodbit.js: _type1 <= ONE"  );
        assert( _type2 <= ONE,  "foodbit.js: _type2 <= ONE"  );  

        this.setColorAccordingToType();
	}
    */


/*
    //--------------------------------------
	this.setColor = function( r, g, b )
	{
	    _red    = r;
	    _green  = g;
	    _blue   = b;
	}
*/  

    //------------------------------------------------
	this.setColorAccordingToType = function()
	{
        if ( _type === 0 ) { _red = 0.3; _green = 0.8; _blue = 0.2; }
        if ( _type === 1 ) { _red = 0.3; _green = 0.5; _blue = 0.9; }

        // slam it to green - for debugging...
        //_red = 0.2; _green = 0.8; _blue = 0.2;

        /*	
        let redX    = 0.0; 
        let greenX  = 0.0; 
        let blueX   = 0.0; 
        let redY    = 0.0; 
        let greenY  = 0.0; 
        let blueY   = 0.0; 
        let redC    = 0.0; 
        let greenC  = 0.0; 
        let blueC   = 0.0; 
        
        let xx = ( _type1 - ONE_HALF ) * 1.5;
        let yy = ( _type2 - ONE_HALF ) * 1.5;
        
        let distance = Math.sqrt( xx * xx + yy * yy );
        
        let centerIntensity = ONE - distance;
        
        redC    = 0.0 * centerIntensity;
        greenC  = 1.0 * centerIntensity;
        blueC   = 0.0 * centerIntensity;
        
        if ( _type1 < ONE_HALF ) 
        { 
            let n = ONE - _type1 * 2;
            
            redX   = n * 1.0;//2.0; 
            greenX = n * 0.0;//0.2; 
            blueX  = n * 0.0;//0.2; 
        }
        else
        {
            let n = ( _type1 - ONE_HALF ) * 2;
            
            redX   = n * 0.0;//0.4; 
            greenX = n * 0.0;//0.4; 
            blueX  = n * 1.0;//2.0; 
        }

        if ( _type2 < ONE_HALF ) 
        { 
            let n = ONE - _type2 * 2;
            
            redY   = n * 0.5;//2.0; 
            greenY = n * 1.0;//2.0; 
            blueY  = n * 0.5;//0.2; 
        }
        else
        {
            let n = ( _type2 - ONE_HALF ) * 2;
            
            redY   = n * 1.0;//0.4; 
            greenY = n * 0.0;//2.0; 
            blueY  = n * 0.0;//2.0; 
        }
        
        _red   = redX   + redY   + redC;   
        _green = greenX + greenY + greenC;   
        _blue  = blueX  + blueY  + blueC; 
        
        if ( _red   > ONE ) { _red      = ONE; }  
        if ( _green > ONE ) { _green    = ONE; }  
        if ( _blue  > ONE ) { _blue     = ONE; }  
        */
    }
    
        
    
    //----------------------------------------------------------------------------
	this.spawnFromParent = function( parentFoodBit, childIndex, childType )
	{
        //console.log( parentFoodBit.index + ", " + childIndex );
        	
        assert( parentFoodBit.getIndex() != NULL_INDEX, "foodbit.js: spawnNearParent: parentFoodBit.index != NULL_INDEX" );
        assert( parentFoodBit.getAlive(), "foodbit.js: spawnNearParent: parentFoodBit.getAlive()" );
        assert( childIndex != NULL_INDEX, "foodbit.js: spawnNearParent: childIndex != NULL_INDEX" );
        
        if ( childIndex === parentFoodBit.getIndex() )
          {
              // warning: childIndex same as parentFoodBit index
          }
        
        //assert( childIndex != parentFoodBit.getIndex(), "foodbit.js: spawnNearParent: childIndex != parentFoodBit.index" );

        _index      = childIndex;
        _opacity    = ZERO;
        _energy     = parentFoodBit.getEnergy();
        _type       = childType;
                
        this.setColorAccordingToType();
        
        //-----------------------------
        // set the position
        //-----------------------------      
        _position.set( parentFoodBit.getPosition() );

        //-----------------------------
        // randomize position
        //-----------------------------      
        this.randomizeSpawnPosition( parentFoodBit );

        /*
        let xx = Math.random() * Math.random();
        let yy = Math.random() * Math.random();

        if ( Math.random() < ONE_HALF ) { xx *= -ONE; }
        if ( Math.random() < ONE_HALF ) { yy *= -ONE; }

        _position.x += xx *= _maxSpawnRadius;
        _position.y += yy *= _maxSpawnRadius;

        //-----------------------------
        // pool boundary collisions
        //-----------------------------      
        let pb = POOL_TOP       + FOOD_BIT_BOUNDARY_MARGIN;
        let pt = POOL_BOTTOM    - FOOD_BIT_BOUNDARY_MARGIN;
        let pl = POOL_LEFT	    + FOOD_BIT_BOUNDARY_MARGIN;
        let pr = POOL_RIGHT	    - FOOD_BIT_BOUNDARY_MARGIN;
        
        //console.log( "before:" + _position.y );
        
                if ( _position.y < pb ) { _position.y += ( ( pb - _position.y ) * 2 ); }
        else	if ( _position.y > pt ) { _position.y += ( ( pt - _position.y ) * 2 ); }
                if ( _position.x > pr ) { _position.x += ( ( pr - _position.x ) * 2 ); }
        else	if ( _position.x < pl ) { _position.x += ( ( pl - _position.x ) * 2 ); }
        
        //console.log( "after:" + _position.y );        
        
        if ( SPAWN_FOOD_RANDOMLY_IN_POOL )
        {
            _position.x = POOL_LEFT + Math.random() * POOL_WIDTH;
            _position.y = POOL_TOP  + Math.random() * POOL_HEIGHT;
        }   
        

        assert( _position.x < POOL_RIGHT,   "foodbit.js: spawnNearParent: _position.x < POOL_RIGHT"  );
        assert( _position.x > POOL_LEFT,    "foodbit.js: spawnNearParent: _position.x > POOL_LEFT"   );
        assert( _position.y > POOL_TOP,     "foodbit.js: spawnNearParent: _position.y < POOL_TOP"	);
        assert( _position.y < POOL_BOTTOM,  "foodbit.js: spawnNearParent: _position.y > POOL_BOTTOM" );
        */
        
    }




    //-----------------------------------------------------------
	this.randomizeSpawnPosition = function( parentFoodBit )
    {
        _position.set( parentFoodBit.getPosition() );

        let xx = Math.random() * Math.random();
        let yy = Math.random() * Math.random();

        if ( Math.random() < ONE_HALF ) { xx *= -ONE; }
        if ( Math.random() < ONE_HALF ) { yy *= -ONE; }

        _position.x += xx * _maxSpawnRadius;
        _position.y += yy * _maxSpawnRadius;

        //-----------------------------
        // pool boundary collisions
        //-----------------------------      
        let pb = POOL_TOP       + FOOD_BIT_BOUNDARY_MARGIN;
        let pt = POOL_BOTTOM    - FOOD_BIT_BOUNDARY_MARGIN;
        let pl = POOL_LEFT	    + FOOD_BIT_BOUNDARY_MARGIN;
        let pr = POOL_RIGHT	    - FOOD_BIT_BOUNDARY_MARGIN;
        
        //console.log( "before:" + _position.y );
        
                if ( _position.y < pb ) { _position.y += ( ( pb - _position.y ) * 2 ); }
        else	if ( _position.y > pt ) { _position.y += ( ( pt - _position.y ) * 2 ); }
                if ( _position.x > pr ) { _position.x += ( ( pr - _position.x ) * 2 ); }
        else	if ( _position.x < pl ) { _position.x += ( ( pl - _position.x ) * 2 ); }
        
        //console.log( "after:" + _position.y );        
        
        if ( SPAWN_FOOD_RANDOMLY_IN_POOL )
        {
            _position.x = POOL_LEFT + Math.random() * POOL_WIDTH;
            _position.y = POOL_TOP  + Math.random() * POOL_HEIGHT;
        }   
        

        assert( _position.x < POOL_RIGHT,   "foodbit.js: spawnNearParent: _position.x < POOL_RIGHT"  );
        assert( _position.x > POOL_LEFT,    "foodbit.js: spawnNearParent: _position.x > POOL_LEFT"   );
        assert( _position.y > POOL_TOP,     "foodbit.js: spawnNearParent: _position.y < POOL_TOP"	);
        assert( _position.y < POOL_BOTTOM,  "foodbit.js: spawnNearParent: _position.y > POOL_BOTTOM" );
    }



    //-----------------------------
	this.setPosition = function(p)
	{
        _position.set(p);
        
                if ( _position.y < POOL_TOP    ) { _position.y = POOL_TOP    + FOOD_BIT_SIZE; }
        else	if ( _position.y > POOL_BOTTOM ) { _position.y = POOL_BOTTOM - FOOD_BIT_SIZE; }
                if ( _position.x > POOL_RIGHT  ) { _position.x = POOL_RIGHT  - FOOD_BIT_SIZE; }
        else	if ( _position.x < POOL_LEFT   ) { _position.x = POOL_LEFT   + FOOD_BIT_SIZE; }

        assert( _position.x < POOL_RIGHT,   "foodbit.js: setPosition: _position.x < POOL_RIGHT"  );
        assert( _position.x > POOL_LEFT,    "foodbit.js: setPosition: _position.x > POOL_LEFT"   );
        assert( _position.y > POOL_TOP,     "foodbit.js: setPosition: _position.y < POOL_TOP"	);
        assert( _position.y < POOL_BOTTOM,  "foodbit.js: setPosition: _position.y > POOL_BOTTOM" );
    }



    //-------------------------------
	this.shiftPosition = function(s)
	{
	    _position.x += s.x;
	    _position.y += s.y;
    }
        
    //-----------------------------------
	this.setMaxSpawnRadius = function(r)
	{
	    _maxSpawnRadius = r;
	    	    
	    assert( _maxSpawnRadius <= MAX_FOOD_BIT_MAX_SPAWN_RADIUS, "FoodBit: setMaxSpawnRadius: _maxSpawnRadius <= MAX_FOOD_BIT_MAX_SPAWN_RADIUS" );
	    
	    assert( _maxSpawnRadius >= MIN_FOOD_BIT_MAX_SPAWN_RADIUS, "FoodBit: setMaxSpawnRadius: _maxSpawnRadius >= MIN_FOOD_BIT_MAX_SPAWN_RADIUS" );
    }
    
        
    //----------------------------------
	this.getMaxSpawnRadius = function()
	{
	    return _maxSpawnRadius;	    
    }

    //----------------------------
	this.setEnergy = function(e)
	{
	    _energy = e;	

	    assert( _energy <= MAX_FOOD_BIT_ENERGY, "FoodBit:getMaxSpawnRadius setEnergy: _energy <= MAX_FOOD_BIT_ENERGY" );
	    assert( _energy >= MIN_FOOD_BIT_ENERGY, "FoodBit:getMaxSpawnRadius setEnergy: _energy >= MIN_FOOD_BIT_ENERGY" );
    }

    //----------------------
    this.kill = function()
    {	
        _index = NULL_INDEX;
    }
    
	//----------------------------
	// getters
	//---------------------------
	this.getPosition    = function() { return _position;    }
	this.getEnergy      = function() { return _energy;      }
	this.getType   = function() { return _type;   }
	this.getIndex       = function() { return _index;       }
    this.getAlive       = function() { return ( _index != NULL_INDEX ); }

	//----------------------------
	// update
	//----------------------------
	this.update = function()
	{
        //----------------------------------------------------------
        // foodbits are born transparent...they become more opaque 
        // and then reach max visability within a few seconds
        //----------------------------------------------------------
	    if ( _opacity < ONE )
	    {
    	    _opacity += FOOD_OPACITY_INCREMENT;
	        if ( _opacity > ONE )
	        {
	            _opacity = ONE;
	        }
        }	
    }
    
    
	//--------------------------------
	// render
	//--------------------------------
	this.render = function( vewScale )
	{
        //canvas.fillStyle = "rgba( " + FOOD_BIT_COLOR_COMPONENTS + ", " + _opacity + ")";	    

        canvas.fillStyle 
        = "rgba( " 
        + Math.floor( _red   * 255 ) + ", " 
        + Math.floor( _green * 255 ) + ", " 
        + Math.floor( _blue  * 255 ) + ", "
        + _opacity + ")";	    
	    
	    let radius = FOOD_BIT_SIZE + vewScale * FOOD_BIT_SIZE_VIEW_SCALE * FOOD_BIT_SIZE_VIEW_SCALE;
	    
        canvas.beginPath();
        canvas.arc( _position.x, _position.y, radius, 0, PI2, false );
        canvas.fill();
        canvas.closePath();	
    }

	//----------------------------
	// render moused-over outline
	//---------------------------
	this.renderMousedOverOutline = function( viewScale )
	{
	    this.showSelectCircle( viewScale, FOOD_BIT_ROLLOVER_COLOR );
    }

	//----------------------------
	// render select outline
	//---------------------------
	this.renderSelectOutline = function( viewScale )
	{
	    this.showSelectCircle( viewScale, FOOD_BIT_SELECT_COLOR );
    }
    
	//-----------------------------------------------------
	this.showSelectCircle = function( viewScale, color )
    {
	    let lineWidth = 1.0 + 0.005 * viewScale; 	
        
        canvas.lineWidth = lineWidth;
        canvas.strokeStyle = "rgba( 100, 200, 100, 0.05 )";	
        canvas.beginPath();
        canvas.arc( _position.x, _position.y, FOOD_BIT_GRAB_RADIUS, 0, PI2, false );
        canvas.stroke();
        canvas.closePath();	

        canvas.lineWidth = lineWidth * 0.3;
        canvas.strokeStyle = "rgba( 100, 200, 100, 0.1 )";	
        canvas.beginPath();
        canvas.arc( _position.x, _position.y, FOOD_BIT_GRAB_RADIUS, 0, PI2, false );
        canvas.stroke();
        canvas.closePath();		    
     }
       
}

// === simulation/SwimbotTypes.js ===
//--------------------------------------------------------------------------
//                                                                        
//    This file is part of GenePool Swimbots.                             
//    Copyright (c) 2021 by Jeffrey Ventrella - All Rights Reserved.      
//                                                                        
//    See the README file or go to swimbots.com for full license details.           
//    You may use, distribute, and modify this code only under the terms  
//    of the "Commons Clause" license (commonsclause.com).                
//                                                                        
//    This software is intended for education, game design, and research. 
//                                                                        
// -------------------------------------------------------------------------- 

"use strict";

//-------------------------------------------
//  time-related constants
//-------------------------------------------
const TIMER_DELTA_INCREASE_RATE = 0.02;
const STARVING_TIMER_DELTA = 0.05;

//----------------------------------------
//  part indices
//----------------------------------------
const NULL_PART       = -1;
const ROOT_PART       =  0;
const MOUTH_INDEX	  =  0;
const GENITAL_INDEX   =  1;
const MIN_PARTS 	  =  2;
const MAX_PARTS 	  = 16;

//-------------------------------------------
//  max swimbot population size
//-------------------------------------------
//const MAX_SWIMBOTS = 2000;  // this has been moved to ExperimentParameters.js

//------------------------------------------
// attraction
//------------------------------------------
const ATTRACTION_NULL               = -1;
const ATTRACTION_COLORFUL           =  0;
const ATTRACTION_BIG                =  1;
const ATTRACTION_HYPER              =  2;
const ATTRACTION_LONG               =  3;
const ATTRACTION_STRAIGHT           =  4;
const ATTRACTION_NO_COLOR           =  5;
const ATTRACTION_SMALL              =  6;
const ATTRACTION_STILL              =  7;
const ATTRACTION_SHORT              =  8;
const ATTRACTION_CROOKED            =  9;
const ATTRACTION_SIMILAR_COLOR      = 10;
const ATTRACTION_SIMILAR_SIZE       = 11;
const ATTRACTION_SIMILAR_HYPER      = 12;
const ATTRACTION_SIMILAR_LENGTH     = 13;
const ATTRACTION_SIMILAR_STRAIGHT   = 14;
const ATTRACTION_CLOSEST            = 15;
const ATTRACTION_RANDOM             = 16;
const NUM_ATTRACTIONS               = 17;




//-----------------------------------
//  metrics 
//-----------------------------------
const SWIMBOT_MIN_MOUTH_WIDTH   = 4.0;
const SWIMBOT_MIN_MOUTH_LENGTH  = 8.0;
const SWIMBOT_MOUTH_LENGTH      = 10.0;
const SWIMBOT_GENITAL_LENGTH    = 10.0;
const SWIMBOT_MOUTH_WIDTH       = 1.0;
const SWIMBOT_GENITAL_WIDTH     = 1.0;
const SWIMBOT_VIEW_RADIUS	    = 300.0;
const SWIMBOT_EGG_RADIUS	    = 6.0;

//const SELECT_RADIUS_SCALAR      = 7.0;

//const SWIMBOT_NUTRITION_ENERGY  = 10.0;



// this has been moved to ExperimentParameters.js
/*
//----------------------------------------
//  LOD 
//----------------------------------------
const SWIMBOT_LEVEL_OF_DETAIL_DOT  = 0;
const SWIMBOT_LEVEL_OF_DETAIL_LOW  = 1;
const SWIMBOT_LEVEL_OF_DETAIL_HIGH = 2;
*/

//--------------------
//  physics constants
//--------------------
//original
//static const double SPIN_FORCE = 0.4;
//static const double SPIN_DECAY = 0.95;

//const SPIN_SCALAR     = 0.01;
//const SPIN_DECAY      = 0.95;

//before May 5:
//const SPIN_SCALAR     = 5.0;
//const SPIN_DECAY      = 0.9;

//const SPIN_SCALAR     = 2.0;
//const SPIN_SCALAR     = 1.0;
//const SPIN_DECAY      = 0.95;

const WALL_BOUNCE = 0.1;


//---------------------------------------------------
//  graphics 
//---------------------------------------------------
// this has been moved to ExperimentParameters.js
//const SIZE_VIEW_SCALE = 0.03; //increase with view scale (a kind of LOD)


//---------------------------------------------------
//  energy 
//---------------------------------------------------
const ENERGY_USED_UP_SWIMMING				= 0.01;
const STARVING								= 4.0;
const CONTINUAL_ENERGY_DRAIN				= 0.0001;


// ranges from 0 to 1 with 0 being not picky at all and 1 being totally 'nothing else'
//const SWIMBOT_NUTRITION_PICKINESS = 0.7;

//const MAX_SWIMBOT_HUNGER_THRESHOLD          = 100;
//const MAX_SWIMBOT_HUNGER_THRESHOLD          = 200;// this has been moved to ExperimentParameters.js

//const DEFAULT_SWIMBOT_HUNGER_THRESHOLD		= 50;// this has been moved to ExperimentParameters.js
//const DEFAULT_SWIMBOT_ATTRACTION            = ATTRACTION_SIMILAR_COLOR;

const ENERGY_EFFICIENCY_MEASUREMENT_PERIOD  = 200;

//--------------------
//  Part 
//--------------------
function Part()
{	
	this.category			= 0;
	this.position			= new Vector2D();   //dynamic
	this.velocity			= new Vector2D();   //dynamic
	this.axis 		        = new Vector2D();   //dynamic
	this.previousMid 		= new Vector2D();   //dynamic
	this.midPosition 		= new Vector2D();   //dynamic
	this.perpendicular		= new Vector2D();   //dynamic
	this.bendingAngle		= ZERO;             //dynamic
	this.currentAngle		= ZERO;             //dynamic
	this.parent 			= NULL_PART;
	this.child              = NULL_PART; // only valid if it is the continuation of a single-category section
	this.mass				= ZERO;
	this.length				= ZERO;
	this.width				= ZERO;
    this.angle		        = ZERO;
	this.frequency			= ZERO;
	this.phase				= ZERO;
	this.amp			    = ZERO;
	this.turnAmp		    = ZERO;
	this.turnPhase	        = ZERO;
	this.momentFactor		= ZERO;
	this.red				= ZERO;
	this.green				= ZERO;
	this.blue				= ZERO;
    this.endCapSpline       = ZERO;     // how pointy the splined end-cap is for parts that terminate body sequence
	this.branch             = false;    // set to true if this part branches off (not a continuation of a category)
    this.splined		    = false;
	this.numDecendents		= 0;
	this.decendent			= new Array( MAX_PARTS );

	for (let p=0; p<MAX_PARTS; p++)
	{
		this.decendent[p] = 0; 
	}
}

//--------------------
//  Phenotype 
//--------------------
function Phenotype()
{	
	this.numParts           = 0;
	this.frequency          = ZERO;
	this.parts              = new Array( MAX_PARTS ); 
	this.sumPartLengths     = ZERO;
	this.mass               = ZERO;
	this.preferredFoodType  = 0;
	this.digestibleFoodType = 0;
	
	for (let p=0; p<MAX_PARTS; p++)
	{
		this.parts[p] = new Part(); 
	}
}




// === simulation/Genotype.js ===
//--------------------------------------------------------------------------
//                                                                        
//    This file is part of GenePool Swimbots.                             
//    Copyright (c) 2021 by Jeffrey Ventrella - All Rights Reserved.      
//                                                                        
//    See the README file or go to swimbots.com for full license details.           
//    You may use, distribute, and modify this code only under the terms  
//    of the "Commons Clause" license (commonsclause.com).                
//                                                                        
//    This software is intended for education, game design, and research. 
//                                                                        
// -------------------------------------------------------------------------- 

"use strict";


//const NUM_GENES = 100;
const NUM_GENES = 256;

//const MUTATION_RATE   = 0.0;
//const MUTATION_RATE	= 0.01; // original
//const MUTATION_RATE	= 0.05;
//const MUTATION_RATE	= 0.2;
//const MUTATION_RATE   = 1.0;

//const CROSSOVER_RATE	= 0.2;
const MIN_GENE_VALUE	= 0;

//const NON_REPRODUCING_JUNK_DNA_LIMIT = 0.9; 


const PRESET_GENOTYPE_DARWIN    =  0;
const PRESET_GENOTYPE_WALLACE   =  1;
const PRESET_GENOTYPE_MENDEL    =  2;
const PRESET_GENOTYPE_TURING    =  3;
const PRESET_GENOTYPE_MARGULIS  =  4;
const PRESET_GENOTYPE_WILSON    =  5;
const PRESET_GENOTYPE_DAWKINS   =  6;
const PRESET_GENOTYPE_DENNETT   =  7;

/*
const PRESET_GENOTYPE_THING     =  8;
const PRESET_GENOTYPE_CRAZY     =  9;
const PRESET_GENOTYPE_OTTO      = 10;
const PRESET_GENOTYPE_SQUIRM    = 11;
const PRESET_GENOTYPE_WHIPPER   = 12;
const PRESET_GENOTYPE_FAST      = 13;
const PRESET_GENOTYPE_BLIP      = 14;
*/


//-------------------
function Genotype()
{
	//------------------------------------------------
	// create array of genes and initialize to 0
	//------------------------------------------------
	let _genes = new Uint8Array( NUM_GENES );
	
    for (let g=0; g<NUM_GENES; g++)
    {
        _genes[g] = 0;             
    }

	//--------------------------------
	// randomize genes
	//--------------------------------
	this.randomize = function()
	{	    
        //----------------------------------------------
        // each gene is a non-negative integer < 256
        //----------------------------------------------
		for (let g=0; g<NUM_GENES; g++)
		{
			_genes[g] = Math.floor( Math.random() * BYTE_SIZE );
            assert( _genes[g] < BYTE_SIZE, "Genotype: randomize: _genes[g] < BYTE_SIZE" );  
            assertInteger( _genes[g], "Genotype:randomize; assertInteger( _genes[g]" );	
		}
	}
		
	//------------------------------------------
	// set all genes to one value
	//------------------------------------------
	this.setAllGenesToOneValue = function(v)
	{	    
		for (let g=0; g<NUM_GENES; g++)
		{
			_genes[g] = v;
            assert( _genes[g] < BYTE_SIZE, "Genotype:setAllGenesToOneValue: _genes[g] < BYTE_SIZE" );  	
            assertInteger( _genes[g], "Genotype:setAllGenesToOneValue; assertInteger( _genes[g]" );	
		}		
	}

	
	//------------------------------------------
	// set all genes to zero
	//------------------------------------------
	this.clear = function(v)
	{	    
		for (let g=0; g<NUM_GENES; g++)
		{
			_genes[g] = 0;  			
		}		
	}
	
    //-------------------------------
	this.getGeneValue = function(g)
	{ 
	    //console.log( _genes[g] );

        assertInteger( _genes[g], "Genotype:getGeneValue; assertInteger( _genes[g]" );	
	
        return _genes[g];
    }  
 
    //-------------------------------
	this.getGeneName = function(g)
	{ 
        return "not implemented yet!";
    }  
 
    //-------------------------------
	this.getGenes = function()
	{ 
        return _genes;
    }
 
    //-----------------------------------
    this.setGenes = function(g)
	{ 
        for (let i=0; i<NUM_GENES; i++)
        {
            assertInteger( g[i], "Genotype:setGenes: assertInteger: g[i]" );
        }

        _genes = g;
    }

    //-----------------------------------
	this.setGeneValue = function( g, v )
	{ 
        assert( v < BYTE_SIZE, "Genotype:setGeneValue: v < BYTE_SIZE");
        assertInteger( v, "Genotype:setGeneValue; assertInteger, v" );	

        _genes[g] = v;
    } 
    
    
    //------------------------------------------------
	this.copyFromGenotype = function( otherGenotype )
	{ 
        for (let g=0; g<NUM_GENES; g++)
        {        
            _genes[g] = otherGenotype.getGeneValue(g);
            assert( _genes[g] < BYTE_SIZE, "Genotype:copyFromGenotype: assert _genes[g] < BYTE_SIZE" );
            assertInteger( _genes[g], "Genotype:copyFromGenotype; assertInteger, _genes[g]" );	        
        }
    }    
    
	//--------------------------------
	// set to Froggy
	//--------------------------------
	this.setToFroggy = function()
	{ 
	    let g = -1;
	    
//g++; _genes[g] = Math.floor( Math.random() * BYTE_SIZE ); // frequency
g++; _genes[g] = 255;
        g++; _genes[g] =  70; //cutOff        
        
		for (let c=0; c<3; c++)
		{
            let category    = 0;
            let redTest     = 0;
            let startWidth  = 160;
            let endLength   = 200;

            if ( c === 0 )
            {
                category    = 200;
                redTest     = 255;
                startWidth  = 255;
                endLength   = 0;
            }  

            //-----------------------------------------
		    // order matters!!!
            //-----------------------------------------
            g++; _genes[g] =  80;       //start red
            g++; _genes[g] = 150;       //start green
            g++; _genes[g] =  20;       //start blue
            g++; _genes[g] =  80;       //end red
            g++; _genes[g] = 150;       //end green
            g++; _genes[g] =  20;       //end blue            
            g++; _genes[g] = startWidth;//startWidth      
            g++; _genes[g] =  80;       //endWidth        
            g++; _genes[g] = 100;       //startLength     
            g++; _genes[g] = endLength; //endLength                 
            
            g++; _genes[g] = Math.floor( Math.random() * BYTE_SIZE );  //amp             
            g++; _genes[g] = Math.floor( Math.random() * BYTE_SIZE );  //phase      
            g++; _genes[g] = Math.floor( Math.random() * BYTE_SIZE );  //turnAmp         
            g++; _genes[g] = Math.floor( Math.random() * BYTE_SIZE );  //turnPhase       
            g++; _genes[g] = Math.floor( Math.random() * BYTE_SIZE );  //branchAmp             
            g++; _genes[g] = Math.floor( Math.random() * BYTE_SIZE );  //branchPhase      
            g++; _genes[g] = Math.floor( Math.random() * BYTE_SIZE );  //branchTurnAmp         
            g++; _genes[g] = Math.floor( Math.random() * BYTE_SIZE );  //branchTurnPhase       
            
            g++; _genes[g] = 0;         //sequenceCount       
            g++; _genes[g] = 0;         //branchPeriod    
            g++; _genes[g] = 180;       //branchAngle     
            g++; _genes[g] = 100;       //branchNumber    
            g++; _genes[g] = 0;         //branchShift                 
            g++; _genes[g] = category;  //branchCategory  
            g++; _genes[g] = 0;         //branchReflect               
            
            g++; _genes[g] = 255;       //splined   
            g++; _genes[g] = 100;       //end cap spline 
	    }
    }


	//--------------------------------
	// set to preset
	//--------------------------------
	this.setToPreset = function(i)
	{ 	
	    if ( i === PRESET_GENOTYPE_DARWIN )
        {
            
            _genes = [221,119,52,33,67,152,215,148,178,16,90,96,24,228,117,196,63,226,175,42,189,188,177,128,231,92,193,72,96,174,59,125,130,71,45,246,137,237,225,87,179,130,178,25,221,61,90,200,57,185,107,126,58,79,161,175,125,36,88,100,72,123,43,34,22,251,26,194,105,75,99,131,154,33,0,163,244,93,132,10,126,240,253,18,122,82,226,208,139,163,228,191,184,202,109,231,66,133,24,208,3,222,132,72,228,212,147,195,115,7,103,103,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,218,0,152,0,229,0,0,0,0,0,0,0,0,0,61,0,0,0,0,0,0,0,0,0,226,0,0,0,0,0,0,0,75,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,66,0,0,0,0,0,0,0,0,0,230,0,0,0,0,141,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,77,0];
            
            
            
            //_genes = [206,68,117,146,159,220,112,48,236,144,137,53,248,196,63,41,102,208,124,237,190,206,136,188,168,176,106,188,155,52,104,70,31,239,156,215,57,233,191,73,171,226,221,194,43,73,0,84,183,2,139,138,232,22,245,149,20,146,198,172,45,36,58,32,81,61,30,3,213,133,227,198,168,108,119,177,101,4,173,163,161,115,149,28,145,14,71,132,150,246,130,59,131,123,107,179,121,13,78,121,172,7,111,52,117,17,200,127,90,175,164,214,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,176,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];   
            
            
            
            //_genes = [148,179,153,206,12,89,101,228,176,166,129,117,172,249,172,220,200,68,191,80,40,163,98,92,65,123,239,249,57,197,136,67,205,35,139,4,43,12,240,193,210,209,127,20,207,180,226,10,182,214,39,227,168,193,222,30,221,253,168,11,180,243,165,232,50,69,198,224,233,180,127,133,165,192,55,68,202,201,84,121,179,133,207,64,43,228,172,96,124,94,218,125,252,197,109,54,87,2,57,37,65,64,12,114,112,202,57,218,40,92,58,221,0,0,0,40,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,76,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,218,0,0,0,0,0,0,0,0,0,0,0,0,0,246,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,36,0,0,0,0,0,0,0,0,0,0,185,0,0,0,0,247,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,59,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; 
                       
            // previous...
            /*            [157,191,232,48,167,41,45,248,148,141,182,184,100,252,240,199,242,14,188,237,205,200,73,165,15,20,72,193,196,171,101,28,14,200,148,251,235,50,224,247,34,251,61,126,92,32,55,170,43,65,40,114,253,229,76,209,236,228,16,94,68,134,142,241,27,213,164,14,159,194,211,181,117,97,230,155,92,39,168,100,155,26,142,133,119,67,14,163,248,150,71,187,141,46,66,79,141,210,60,76,203,193,73,7,57,109,159,16,42,103,161,68,184,50,116,19,31,171,45,71,176,186,34,236,19,234,164,6,72,63,40,21,39,82,129,18,24,38,122,9,175,56,221,77,75,253,28,242,107,64,48,31,48,221,122,115,15,164,150,242,110,65,128,161,117,58,183,222,192,146,163,52,56,26,206,32,232,220,132,230,46,206,3,97,85,167,58,124,53,191,32,55,112,43,115,127,218,200,4,150,195,143,205,67,128,222,120,175,1,31,207,165,49,39,165,178,10,147,209,195,138,221,125,1,104,141,65,27,44,131,176,74,152,113,49,60,167,173,67,67,238,236,178,9,175,88,42,239,163,132,154,38,72,252,195,211];
            */
        }
        else if ( i === PRESET_GENOTYPE_WALLACE )
        {
            _genes = [225,255,16,20,193,39,82,165,61,249,85,179,186,20,221,200,134,112,90,134,71,187,231,246,94,189,30,187,191,67,113,239,116,137,212,7,38,123,17,40,157,140,131,135,159,180,31,123,171,77,150,192,87,39,103,245,56,23,4,64,105,192,4,49,252,99,192,7,137,242,2,92,23,129,175,192,78,68,130,139,4,81,214,152,50,209,72,212,54,187,223,1,64,217,239,20,203,159,202,223,41,131,61,10,35,186,93,222,235,99,248,146,0,252,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,215,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,155,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,144,0,0,0,0,0,0,0,0,0,55,0,27,220,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,112,216,0,0,228,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0];            
            
            /*
            [117,40,99,96,7,180,190,117,87,232,6,168,83,48,202,171,208,112,31,99,138,17,48,20,126,186,129,107,225,210,21,89,147,244,150,220,216,210,135,221,184,142,221,107,128,184,68,168,201,36,16,47,66,249,153,246,62,253,58,118,0,154,57,61,185,234,77,141,170,238,62,220,0,11,41,221,29,105,220,51,187,55,147,209,49,74,145,112,126,108,98,252,11,105,62,77,221,46,240,234,59,106,31,8,160,16,28,14,155,15,38,38,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,126,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,232,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];        
            */
            /*
            [200,125,201,202,176,144,133,112,224,84,85,131,60,148,6,152,119,172,146,194,104,205,186,108,86,6,252,172,29,172,50,184,181,160,101,150,30,28,130,231,50,7,17,103,87,200,7,111,220,120,138,233,188,234,157,194,83,216,14,143,168,58,104,225,102,56,93,209,21,241,215,12,156,127,241,242,183,51,28,56,32,166,117,13,210,193,19,97,145,222,231,23,152,227,238,56,195,179,140,74,92,158,134,113,129,168,83,204,168,91,205,152,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,247,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,94,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,66,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];  
            */
     
            //previous
            /*
            [131,167,210,41,139,159,161,137,34,163,228,245,144,62,33,94,118,244,172,92,55,201,151,131,24,250,217,133,87,214,170,232,195,236,88,111,160,103,128,57,93,180,13,139,136,126,26,153,71,135,25,186,178,61,130,213,252,118,87,17,107,22,49,212,237,156,186,168,221,10,228,149,149,195,254,89,166,110,34,59,13,161,154,139,150,252,181,121,94,72,247,125,32,78,112,61,123,182,85,187,163,146,136,149,117,42,187,150,196,245,208,188,252,147,247,64,248,243,188,96,27,100,188,144,142,108,125,51,20,51,55,234,179,209,200,5,220,84,1,7,129,5,218,183,160,128,137,110,247,56,57,199,228,46,5,181,166,160,237,207,179,36,189,87,58,178,215,227,175,190,128,233,79,179,25,164,175,199,109,175,204,67,92,119,131,93,192,177,181,86,162,138,99,103,244,46,134,244,79,8,207,64,97,206,17,60,174,247,181,11,6,149,83,107,146,98,104,179,105,71,175,40,217,58,183,93,184,228,104,157,172,232,57,65,196,38,176,248,195,231,99,227,200,174,52,184,214,31,196,185,100,178,104,47,2,95];
            */            
        }
        else if ( i === PRESET_GENOTYPE_MENDEL )
        {
            _genes = 
            [198,173,57,44,87,12,12,141,51,179,80,108,25,19,59,58,227,71,123,55,230,169,17,157,175,28,127,1,175,228,228,88,150,151,205,44,54,154,58,95,175,67,121,47,109,241,174,223,190,67,76,167,166,136,128,125,209,92,154,206,157,125,97,156,228,20,248,207,218,120,146,154,117,5,217,158,85,129,128,193,179,28,28,63,158,179,178,153,138,21,115,85,176,210,181,20,129,62,199,246,69,58,206,88,70,86,28,129,14,250,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            
            /*[170,44,7,64,235,214,205,52,136,157,245,156,254,24,26,154,254,25,176,62,128,0,18,121,204,144,210,184,82,21,136,146,153,30,75,157,227,63,131,196,139,149,216,222,194,129,213,93,114,41,242,248,244,103,122,214,217,190,165,240,208,232,58,16,232,130,254,106,234,43,92,87,115,107,108,175,141,227,67,167,208,166,34,252,24,201,214,109,101,200,137,47,253,171,107,164,96,195,56,50,221,147,129,50,25,180,116,71,121,180,98,40,0,0,29,0,0,0,0,0,170,168,0,0,0,0,0,0,0,0,176,0,0,0,0,0,0,28,0,0,0,0,0,0,0,55,0,0,0,0,0,0,0,0,0,0,0,0,29,0,60,0,0,0,0,37,0,0,0,0,0,0,0,0,0,0,0,98,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,170,0,125,0,138,0,0,0,0,0,238,0,0,0,0,0,0,0,0,0,0,0,36,250,59,0,0,0,0,233,0,0,0,0,0,0,0,0,0,0,0,239,0,0,0,0,115,48,0,0,0,0,0,0,231,0,0,0,0,0,240];
            */
            /*            [121,117,166,58,69,252,103,97,234,131,25,244,83,214,29,96,233,98,206,227,192,25,6,169,48,106,217,16,61,221,91,36,144,11,133,39,252,45,193,214,141,223,201,90,188,50,172,233,156,0,124,183,87,229,231,134,116,211,50,21,198,127,93,106,153,145,110,72,210,245,56,118,91,186,244,245,211,139,255,91,22,228,10,8,173,109,93,78,221,7,127,173,18,139,60,109,34,99,217,89,134,92,220,252,185,70,163,19,31,148,207,206,240,247,55,189,138,73,30,160,41,254,136,116,241,156,233,65,243,124,224,227,89,14,229,98,73,244,164,179,152,207,18,46,15,118,42,116,185,182,23,238,243,107,102,143,103,182,137,235,31,41,160,198,172,83,175,49,151,128,172,255,97,184,143,217,174,122,245,201,35,125,18,180,193,233,22,36,64,93,206,107,91,12,173,26,167,84,60,118,210,51,178,170,207,118,225,115,176,207,62,210,240,8,118,164,3,27,5,69,39,181,152,30,202,118,97,91,214,120,85,27,195,169,250,100,147,32,77,147,199,20,188,189,128,117,68,111,26,141,163,155,125,172,123,163];
            */
        }
        else if ( i === PRESET_GENOTYPE_TURING )
        {
            _genes =  
            [218,98,60,220,217,72,92,173,200,32,10,46,73,122,88,238,191,209,216,144,167,14,159,231,46,102,30,75,46,149,205,255,253,189,130,76,4,247,141,78,19,83,252,30,21,4,144,21,21,18,214,146,179,239,96,255,217,49,72,6,173,146,20,46,205,190,173,143,226,126,101,14,109,99,38,57,51,97,113,68,151,151,50,129,210,193,140,5,200,21,176,20,134,13,134,241,56,148,154,198,6,140,39,50,76,92,37,40,28,12,155,155,0,0,0,0,0,0,0,0,135,0,0,0,0,0,0,0,0,0,0,0,0,0,234,243,132,0,0,0,0,184,0,0,0,0,0,0,0,0,0,0,0,38,0,0,0,0,0,0,0,0,0,0,109,0,178,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,58,0,0,0,0,0,0,0,0,0,0,0,0,0,29,0,0,0,0,0,0,0,0,175,0,0,0,242,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,39,0,0];
               
            /*        [243,182,66,88,250,28,29,11,166,30,41,14,97,20,149,135,177,92,107,52,188,211,221,195,113,158,85,85,79,157,126,247,199,197,118,113,220,202,3,160,200,10,226,152,123,41,186,44,52,137,162,130,128,39,84,241,73,110,246,109,25,72,21,101,168,170,172,80,91,40,27,42,92,114,67,81,213,83,70,14,109,148,6,228,82,8,85,198,228,84,36,138,157,228,55,254,212,152,119,90,187,150,27,108,204,255,174,186,167,141,3,36,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,244,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,250,0,0,0,0,0,0,0,111,0,0,0,0,0,0,0,0,0,0,0,84,17,0,0,0,0,0,0,16,0,6,0,0,0,0,0,0,0,0,208,0,3,0,0,0,0,0,0,0,0,0,127,0,0,0,0,245,86,0,0,81,0,0,0,0,0,0,0,0,0,24,0,0,0,0];
            */
            /*            [163,72,95,3,33,138,51,22,89,0,75,198,35,0,228,62,245,4,0,138,0,54,194,65,50,77,130,26,27,229,16,194,193,238,3,234,149,2,159,0,124,97,228,183,79,40,34,115,235,134,254,174,8,4,91,50,3,58,2,185,244,209,93,7,254,193,31,162,6,53,184,10,206,253,251,10,155,34,167,162,94,113,14,10,179,7,212,31,185,18,224,2,116,51,253,120,8,7,62,4,49,164,210,49,232,122,2,153,124,15,238,33,16,197,234,145,225,63,188,177,253,6,47,221,10,3,242,155,38,68,28,63,69,23,9,10,33,20,62,122,74,4,140,101,230,33,200,31,90,234,40,80,218,0,185,2,67,224,227,66,247,246,156,168,38,204,142,221,161,6,191,113,30,213,205,67,23,13,50,99,39,101,16,2,156,99,156,1,162,2,121,117,54,17,166,178,153,247,171,138,20,108,11,254,221,205,219,145,244,207,103,243,44,99,241,71,79,75,91,50,56,165,73,238,182,228,0,32,79,6,14,199,18,74,51,252,143,130,254,70,44,144,231,88,119,61,252,1,84,96,229,49,182,0,37,58];
            */
        }
        else if ( i === PRESET_GENOTYPE_MARGULIS )
        {
            _genes = 
            [179,142,165,61,72,193,176,10,42,236,27,231,248,14,217,241,130,170,157,216,239,7,76,234,191,81,221,243,127,96,107,97,191,101,18,205,63,215,116,108,229,64,105,89,121,14,54,225,132,74,120,152,133,110,16,51,74,255,206,80,47,174,72,187,209,126,12,41,249,246,221,86,62,22,2,36,160,157,138,255,60,101,189,212,208,227,213,144,210,51,64,157,238,66,17,99,57,171,135,161,136,156,202,121,111,56,212,6,243,89,236,239,0,0,0,0,0,0,195,80,0,0,0,0,0,0,118,0,188,0,0,0,0,0,0,215,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,104,0,0,0,19,0,0,0,0,35,0,0,0,0,0,0,0,0,0,240,0,231,0,0,146,213,0,0,0,0,0,0,0,0,0,0,0,0,183,0,194,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,99,0,251,0,0,0,0,0,0,0,0,0,0,0,17,0,234,0,0,0,0,0,0,0,0,147,0,0,0,0,0,0,0,0];
                     
            /*
            [170,44,7,64,235,214,205,52,136,157,245,156,84,24,26,154,254,25,176,62,128,0,18,121,204,144,210,184,82,21,140,146,153,30,75,157,227,63,131,196,139,149,216,222,194,129,213,93,114,41,242,248,244,103,122,28,217,190,165,240,59,232,58,16,232,130,254,106,234,52,92,87,115,107,108,175,141,227,67,167,208,166,34,252,24,201,214,102,101,200,137,220,253,171,107,164,96,195,56,50,221,147,129,50,25,180,116,71,121,180,98,40,0,0,29,0,43,0,0,0,170,168,0,0,19,0,0,0,0,0,176,0,0,0,0,0,0,28,0,0,0,0,0,0,0,55,0,0,0,0,0,0,0,0,14,0,0,0,29,0,60,0,0,0,0,37,0,0,0,0,0,0,207,0,0,201,0,98,0,0,0,147,0,0,0,0,0,0,0,0,0,121,0,0,0,170,0,125,0,239,0,0,0,0,0,238,0,0,17,0,0,0,0,0,0,0,0,36,200,59,0,0,0,0,233,0,0,0,87,251,0,0,0,219,0,0,239,0,0,0,0,115,48,0,0,0,132,0,0,231,246,0,0,0,0,240];
            */
            /*            [105,201,49,238,245,97,7,214,163,10,84,150,197,250,251,240,156,194,249,16,240,177,173,91,152,71,71,169,42,6,230,13,17,165,117,239,99,51,115,174,98,251,42,48,174,115,82,76,148,44,105,186,213,153,3,90,140,168,71,180,185,156,164,23,162,203,224,229,3,168,177,245,109,132,48,148,227,101,244,231,143,108,149,176,2,124,211,245,102,207,208,13,75,187,8,0,27,24,89,30,194,117,56,138,107,9,86,191,183,185,12,201,94,170,159,144,81,230,133,82,87,59,4,232,92,199,109,5,73,147,163,127,98,99,12,164,84,235,213,79,204,27,169,230,80,90,224,9,130,199,123,3,144,215,242,16,151,64,204,78,188,181,84,83,158,134,244,19,122,175,252,176,189,28,79,137,253,215,117,48,149,102,14,228,224,49,170,191,52,38,243,33,90,130,48,99,211,144,30,220,98,114,131,179,113,242,161,23,195,44,76,144,113,143,162,173,183,10,155,234,83,147,76,28,50,11,2,97,75,156,5,103,246,191,54,87,44,80,211,92,10,183,247,30,147,114,84,163,245,190,163,106,178,111,136,104];
            */
        }
        else if ( i === PRESET_GENOTYPE_WILSON )
        {
            _genes =      

[155,181,"0",238,176,1,41,250,8,149,9,250,143,79,77,91,51,39,250,63,30,157,250,162,170,162,255,148,46,"0",193,248,132,25,44,114,29,187,174,254,92,45,197,212,115,204,100,239,41,64,32,225,164,196,99,203,"0",205,29,105,17,4,215,9,243,5,80,87,203,114,227,212,99,253,135,233,134,188,145,45,250,196,113,154,162,45,11,154,121,46,240,102,101,126,80,88,55,219,40,240,7,107,151,89,170,172,175,152,101,156,0,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,0,0,228,0,0,0,0,0,0,0,0,0,0,0,148,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,240,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,107,0,0,0,0,0,0,0,0,0,24,63,0,0,0,0,0,0,0,0,0,0,0,0,0,0,228,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,88,0,0,0,0,0,0,0,0,0,0,0,0,0,250,0,3,0,0,0,0,0,0,0,0,0,0,0,0,242,0];            
            
            /*       [81,129,77,180,29,148,75,139,190,102,212,135,45,25,226,77,214,21,165,240,109,94,99,209,165,237,233,166,75,218,86,77,78,44,128,1,72,44,191,65,182,162,11,50,103,142,45,130,52,185,222,160,147,161,45,134,56,248,106,135,57,124,224,33,200,208,47,25,27,45,15,22,162,96,157,115,27,185,34,138,233,196,205,85,221,233,167,90,132,48,217,117,114,194,164,96,42,85,85,154,204,179,37,10,113,76,162,21,7,215,229,70,0,0,0,0,0,0,43,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,24,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,105,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,68,0,0]; 
            */
            
            /*            [120,105,241,1,183,93,70,141,7,30,190,241,5,252,239,106,50,107,211,72,252,149,126,94,121,122,150,244,231,135,204,216,18,198,216,56,243,82,102,138,43,53,93,152,186,158,213,52,211,204,186,132,237,108,191,109,104,35,30,228,108,34,45,213,233,10,20,53,20,235,180,48,190,79,178,60,118,52,194,109,249,223,94,162,234,220,235,129,61,109,249,177,178,69,235,209,214,122,135,82,130,182,231,164,3,19,205,65,69,90,209,237,179,121,8,68,55,140,202,159,108,178,250,93,210,244,123,156,173,146,100,57,85,7,97,239,186,129,176,40,183,63,188,137,129,51,177,7,208,118,175,151,162,240,121,106,130,104,199,208,116,110,8,75,185,233,236,186,99,164,148,88,41,69,149,27,50,163,171,139,31,168,197,94,254,22,185,211,210,220,153,239,67,94,98,190,53,92,36,171,60,221,100,21,233,74,66,199,84,208,2,52,164,88,63,245,212,41,172,149,128,219,211,156,55,100,219,30,78,249,234,46,208,204,246,89,71,145,137,126,114,154,63,171,173,68,49,121,31,207,68,39,171,34,32,33];
            */
        }
        else if ( i === PRESET_GENOTYPE_DAWKINS )
        {
            _genes = [225,172,222,194,35,75,132,158,25,62,15,108,50,126,137,106,112,230,90,58,67,180,141,167,24,244,77,222,209,84,107,204,142,164,197,47,16,13,241,199,241,30,224,216,7,26,0,167,130,101,30,55,219,1,165,188,177,100,67,206,216,161,28,88,150,224,237,255,192,239,230,127,30,159,58,149,140,35,76,79,108,221,233,9,61,14,200,101,124,199,127,47,82,242,176,123,31,19,180,245,247,73,127,243,18,25,128,7,213,69,33,28,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            /*  
            [155,181,234,138,176,186,41,250,36,149,9,250,133,148,115,82,6,211,20,191,244,65,50,125,97,68,48,97,225,165,127,248,132,77,223,73,212,64,178,150,205,124,118,79,125,102,209,194,7,64,32,225,164,161,99,78,133,205,29,88,91,233,148,83,113,224,147,215,203,114,227,212,99,253,162,19,127,148,137,155,109,0,209,99,2,106,184,248,178,66,240,102,98,126,244,88,16,219,40,240,81,162,8,114,216,83,30,56,250,19,75,75,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,0,0,0,0,0,92,0,168,208,102,0,0,108,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,193,0,59,0,0,200,0,0,0,241,195,0,249,0,0,0,252,0,0,0,0,0,0,0,0,0,24,0,0,0,12,0,0,63,0,0,0,0,209,0,0,0,0,0,0,18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,221,0,0,0,0,23,0,4,0,31,0,0,0,0,201,0,239,0,0,230,0,252,52,0,0,0,0,255,0,0,0,0,52,0];
            */
            
            /*
            [125,176,90,108,164,148,75,139,51,121,25,8,189,153,9,99,214,21,193,142,153,130,1,177,182,122,101,117,17,125,47,108,1,205,49,166,94,14,209,84,50,160,184,118,100,113,80,197,52,190,158,188,131,126,109,138,42,116,147,209,149,141,8,98,72,123,147,136,165,15,47,117,133,243,13,36,65,106,171,30,242,74,73,0,172,179,136,81,92,59,48,91,214,58,131,96,87,85,35,252,208,168,37,27,245,161,37,11,128,146,233,169,0,0,0,0,0,0,0,0,6,0,0,41,0,0,0,0,0,0,0,0,142,0,0,0,0,0,0,0,0,0,0,203,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,249,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,102,0,0,0,0,0,0,194,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,17,0,0,0,0,0,0,0,0,0,0,0,0,0,58,0,22,0,0,0,0,0,0,0,0,0,0,169];
            */            
            
            /*
            [175,70,80,150,20,80,150,20,255,80,100,0,226,18,153,215,75,123,192,95,0,0,87,100,9,200,0,255,100,80,150,20,80,150,20,160,80,100,200,125,189,21,8,204,8,66,31,0,0,180,100,0,0,4,255,100,80,150,20,80,150,20,160,36,107,200,129,242,254,217,32,106,110,189,253,0,180,100,0,0,0,255,100,0,0,0,0,99,0,0,25,0,0,132,0,0,0,0,0,0,0,0,0,0,0,244,0,0,0,0,0,0,0,0,0,0,0,0,0,0,174,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,243,0,0,0,0,0,150,0,0,0,0,0,0,0,0,0,0,0,123,0,0,0,0,205,0,0,0,231,0,0,0,0,0,0,0,0,0,41,135,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,33,0,0,0,0,0,0,0,185,0,0,108,0,61,0,0,0,0,0];
            */
        }        
        else if ( i === PRESET_GENOTYPE_DENNETT )
        {
            _genes =             
[218,98,"225",220,217,72,92,173,200,32,10,46,73,122,88,238,191,209,216,144,167,14,159,231,46,102,30,"255",46,"223","244","107",253,189,130,76,4,247,141,78,19,83,252,30,21,4,144,21,21,18,214,146,179,239,"255",255,217,49,"0",6,173,146,20,46,205,190,173,143,226,126,101,14,109,99,38,57,51,97,113,68,151,151,50,129,210,193,140,5,200,21,176,20,134,13,134,241,56,148,154,198,6,140,39,50,76,92,37,40,28,12,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

            /*[105,201,49,238,245,97,7,214,163,10,84,150,197,250,251,240,156,194,249,16,240,177,173,91,152,71,71,169,42,6,230,13,17,165,117,239,99,51,115,174,98,251,42,48,174,115,82,76,148,44,105,186,213,153,3,90,140,168,71,180,185,156,164,23,162,203,224,229,3,168,177,245,109,132,48,148,227,101,244,231,143,108,149,176,2,124,211,245,102,207,208,13,75,187,8,0,27,24,89,30,194,117,56,138,107,9,86,191,183,185,12,201,94,170,159,144,81,230,133,82,87,59,4,232,92,199,109,5,73,147,163,127,98,99,12,164,84,235,213,79,204,27,169,230,80,90,224,9,130,199,123,3,144,215,242,16,151,64,204,78,188,181,84,83,158,134,244,19,122,175,252,176,189,28,79,137,253,215,117,48,149,102,14,228,224,49,170,191,52,38,243,33,90,130,48,99,211,144,30,220,98,114,131,179,113,242,161,23,195,44,76,144,113,143,162,173,183,10,155,234,83,147,76,28,50,11,2,97,75,156,5,103,246,191,54,87,44,80,211,92,10,183,247,30,147,114,84,163,245,190,163,106,178,111,136,104];
            */
            
            /*
            [239,132,90,192,183,6,78,77,93,178,73,216,43,218,29,93,84,72,5,127,211,76,175,226,225,18,108,138,132,180,170,84,241,67,215,240,146,245,37,99,170,16,236,128,5,116,14,16,222,214,94,119,85,217,17,199,102,153,248,221,81,75,94,8,238,145,242,25,19,11,224,84,212,70,87,175,82,114,77,41,130,42,50,93,25,226,176,170,101,15,255,188,110,73,24,240,150,228,226,192,82,114,52,134,22,66,254,94,156,198,211,170,250,169,33,126,49,116,233,62,144,221,147,185,171,69,154,187,234,148,176,227,173,168,165,74,191,10,25,98,81,141,39,31,155,147,211,242,157,179,57,75,17,140,202,52,230,174,136,120,23,209,168,11,192,33,134,133,235,122,92,237,147,186,132,192,141,57,63,224,111,199,129,200,66,100,19,76,173,84,191,254,149,106,91,60,156,114,68,208,5,228,200,1,38,64,239,169,68,77,162,119,163,25,161,45,133,16,74,156,129,194,225,78,212,172,28,49,6,63,82,94,10,68,176,82,20,150,54,81,96,215,173,15,196,159,194,205,200,36,148,194,68,21,150,198];
            */
        }              
    }

//use this...
/*        

*/        
        
    //--------------------------------------------------------
	this.setAsOffspring = function( parent_0, parent_1 )
	{ 	
	    //console.log( parent_0 );
	    //console.log( parent_1 );
	    
	    /*
	    console.log( "----------------------------");
	    console.log( "setAsOffspring");
	    console.log( "----------------------------");

        for (let g=0; g<NUM_GENES; g++)
        {
            console.log( parent_0.genes[g] + ", " + parent_1.genes[g] );
        }
	    */
	    
        //-------------------------------------------
        // start with random parent either 1 or 2
        //-------------------------------------------
        let parent = 0;
        if ( Math.random() < ONE_HALF )
        {
            parent = 1;
        }

        //-------------------------------------------
        // scan genes
        //-------------------------------------------
        for (let g=0; g<NUM_GENES; g++ )
        {
            //-----------------------------------
            // crossover - switch to other parent 
            //-----------------------------------
            if ( Math.random() < CROSSOVER_RATE )
            {
                if ( parent === 0 )
                {
                    parent =  1;
                }
                else 
                {
                    parent = 0;
                }
            }

            //-----------------------------------
            // copy parent gene to child gene 
            //-----------------------------------
            if ( parent === 0 ) 
            {
                assert ( parent_0.getGeneValue(g) >= 0,         "Genotype: setAsOffspring: parent_0.getGeneValue(g) >= 0" );
                assert ( parent_0.getGeneValue(g) < BYTE_SIZE,  "Genotype: setAsOffspring: parent_0.getGeneValue(g) < BYTE_SIZE" );
                assertInteger( parent_0.getGeneValue(g),        "Genotype: setAsOffspring: assertInteger: parent_0.getGeneValue(g)" );	

                _genes[g] = parent_0.getGeneValue(g);
            }
            else 
            {
                assert ( parent_1.getGeneValue(g) >= 0,         "Genotype: setAsOffspring: parent_1.getGeneValue(g) >= 0" );
                assert ( parent_1.getGeneValue(g) < BYTE_SIZE,  "Genotype: setAsOffspring: parent_1.getGeneValue(g) < BYTE_SIZE" );
                assertInteger( parent_1.getGeneValue(g),        "Genotype: setAsOffspring: assertInteger: parent_1.getGeneValue(g)" );	
                
                _genes[g] = parent_1.getGeneValue(g);
            }
            
            assertInteger( _genes[g], "Genotype: setAsOffspring: assertInteger: _genes[g]" );	

            //-----------------------------------
            // mutation
            //-----------------------------------
            if ( Math.random() < MUTATION_RATE ) 
            {
                this.mutateGene(g);
            }
      
            assert ( _genes[g] >= 0, "_genes[g] >=   0" );
            assert ( _genes[g] < BYTE_SIZE, "_genes[g] < BYTE_SIZE" );
            assertInteger( _genes[g], "Genotype: setAsOffspring: AFTER MUTATION...assertInteger: _genes[g]" );	
        }
    }
     

   
    //-----------------------------
	this.mutateGene = function(g)
	{	
        assertInteger( _genes[g], "Genotype: at the start of mutateGene" );
        	
        assert ( _genes[g] >= 0, "mutateGene: _genes[g] >=   0" );
        assert ( _genes[g] < BYTE_SIZE, "mutateGene: _genes[g] < BYTE_SIZE" );
 	

	    //console.log( "mutate gene " + g );
	    
        let amplitude = Math.floor( Math.random() * Math.random() * BYTE_SIZE );
        //console.log( "amplitude = " + amplitude );
    
        //-------------------------------------
        // keep it an integer!!!
        //-------------------------------------
        amplitude = Math.round( amplitude );

        assert( amplitude >= 0, "mutateGene:amplitude >= 0" );
        assert( amplitude < BYTE_SIZE, "mutateGene:amplitude < BYTE_SIZE" );

        if ( Math.random() > ONE_HALF )
        {
            let before = _genes[g];
            _genes[g] += amplitude;
            
            if ( _genes[g] >= BYTE_SIZE ) 
            {
                _genes[g] -= BYTE_SIZE;
            }
            
            //console.log( "gene " + g + " mutated by " + amplitude + "; the value changed from " + before + " to " + _genes[g] );
        }
        else 
        {
            _genes[g] -= amplitude;

            if ( _genes[g] < 0 ) 
            {
                _genes[g] += BYTE_SIZE;
            }
        }

	
        assertInteger( _genes[g], "Genotype: mutateGene" );	
	
        
        assert ( _genes[g] >= 0, "Genotype: mutateGene:_genes[g] >=   0" );
        assert ( _genes[g] < BYTE_SIZE, "Genotype: mutateGene:_genes[g] < BYTE_SIZE" );
    }

   
    //-----------------------------
	this.zap = function( amount )
	{ 
        for (let g=0; g<NUM_GENES; g++ )
        {
            if ( Math.random() < amount )
            {
                this.mutateGene(g);
            }
        }
    }
}


 
 

// === simulation/Embryology.js ===
//--------------------------------------------------------------------------
//                                                                        
//    This file is part of GenePool Swimbots.                             
//    Copyright (c) 2021 by Jeffrey Ventrella - All Rights Reserved.      
//                                                                        
//    See the README file or go to swimbots.com for full license details.           
//    You may use, distribute, and modify this code only under the terms  
//    of the "Commons Clause" license (commonsclause.com).                
//                                                                        
//    This software is intended for education, game design, and research. 
//                                                                        
// -------------------------------------------------------------------------- 

"use strict";

//----------------------------
//  constants
//----------------------------
//const NUM_CATEGORIES = 3;
const NUM_CATEGORIES = 4;

//-------------------------------------
//  gene limits
//-------------------------------------
const MIN_LENGTH            =  3.0; 
const MAX_LENGTH            =  27.0; 
const MIN_WIDTH             =  0.5;
const MIN_SPLINED           =  0; 
const MAX_SPLINED           =  1; 
const MIN_END_CAP_SPLINE    =  0.5; 
const MAX_END_CAP_SPLINE    =  4.0; 

//const MAX_WIDTH             =  5.0; 
const MAX_WIDTH             =  7.0; 


const MIN_FREQUENCY         =  0.02;
const MAX_FREQUENCY         =  0.2;
const MIN_AMP               = -60.0;
const MAX_AMP               =  60.0;
const MIN_PHASE             =  -1.0;
const MAX_PHASE             =   1.0;	
const MIN_COLOR             =   ZERO;
const MAX_COLOR             =   ONE;
const MIN_BRANCH_PERIOD     =   1;
const MAX_BRANCH_PERIOD     =   4;	
const MIN_BRANCH_ANGLE      =  -90.0;
const MAX_BRANCH_ANGLE      =   90.0;
const MIN_BRANCH_NUMBER     =   0;
const MAX_BRANCH_NUMBER     =   3;
const MIN_BRANCH_SHIFT      =   0;
const MAX_BRANCH_SHIFT      =   6;
const MIN_BRANCH_REFLECT    =   0;
const MAX_BRANCH_REFLECT    =   3;
const MIN_BRANCH_CATEGORY   =   0;
const MAX_BRANCH_CATEGORY   =   NUM_CATEGORIES - 1;
const MIN_CUT_OFF           =   MIN_PARTS;
const MAX_CUT_OFF           =   MAX_PARTS - 1;
const MIN_SEQUENCE_COUNT    =   MIN_PARTS;
const MAX_SEQUENCE_COUNT    =   5;
	
const GREATEST_POSSIBLE_SWIMBOT_MASS = MAX_PARTS * MAX_LENGTH * MAX_WIDTH
const GREATEST_POSSIBLE_SWIMBOT_LENGTH	= MAX_PARTS * MAX_LENGTH;


//--------------------
function Embryology()
{	    

let testNoEel = true;

    //-------------------------
    function CategoryValues()
    {	   	
        this.sequenceCount  = ZERO;
        
        //geometry and color
        this.startWidth         = ZERO;
        this.endWidth           = ZERO;
        this.startLength        = ZERO;
        this.endLength          = ZERO;
        this.startRed           = ZERO;
        this.startGreen         = ZERO;
        this.startBlue          = ZERO;
        this.endRed             = ZERO;
        this.endGreen           = ZERO;
        this.endBlue            = ZERO;
        this.splined            = ZERO;
        this.endCapSpline       = ZERO;
        
        // motion
        this.amp                = ZERO;
        this.phase              = ZERO;
        this.turnAmp            = ZERO;
        this.turnPhase          = ZERO;
        this.branchAmp          = ZERO;
        this.branchPhase        = ZERO;
        this.branchTurnAmp      = ZERO;
        this.branchTurnPhase    = ZERO;
        
        //branching
        this.branchPeriod       = ZERO;
        this.branchAngle        = ZERO;
        this.branchNumber       = ZERO;
        this.branchShift        = ZERO;
        this.branchCategory     = ZERO;
        this.branchReflect      = ZERO;
 	}
	    
	//-------------------------------------------------------------
	// variables
	//-------------------------------------------------------------
    let _normalizedGenes        = new Float32Array( NUM_GENES );
    let _geneNames              = new Array( NUM_GENES ); 
    let _branchStatus           = new Array( MAX_PARTS ); 
    let _categoryValues         = new Array( NUM_CATEGORIES ); 
    let _partIndex              = ZERO;
    let _generating             = false;
    let _frequency              = ZERO;
    let _numGenesUsed           = 0;
    let _numGenesPerCategory    = 0;
    let _cutOff                 = 0;
    let preferredFoodTypeGene   = 0;
    let digestibleFoodTypeGene  = 0;
    
	this.getPreferredFoodTypeGene   = function() { return preferredFoodTypeGene;    }
	this.getDigestibleFoodTypeGene  = function() { return digestibleFoodTypeGene;   }

    for (let g=0; g<NUM_GENES; g++)
    {
        _geneNames[g] = "junk";
    }
    
         
	//----------------------------------------------------
	// generate phenotype from genotype
	//----------------------------------------------------
	this.generatePhenotypeFromGenotype = function( genotype )
	{
        //--------------------------------
        // create new phenotype...
        //--------------------------------
		let phenotype = new Phenotype();
		
	    //-----------------------------------
	    // create categories array
	    //-----------------------------------
		for (let c=0; c<NUM_CATEGORIES; c++)
		{
		    _categoryValues[c] = new CategoryValues();
		}

	    //-----------------------------------
	    // initialize branch status
	    //-----------------------------------
		for (let p=0; p<MAX_PARTS; p++)
		{
		    _branchStatus[p] = false;
		}

	    //--------------------------------------------------------
	    // convert the gene values from byte to normalized
	    //--------------------------------------------------------
		for (let g=0; g<NUM_GENES; g++)
		{
            _normalizedGenes[g] = genotype.getGeneValue(g) / BYTE_SIZE;
		    assert( _normalizedGenes[g] >= ZERO, "normalizedGenes[g] >= ZERO" );
		    assert( _normalizedGenes[g] <= ONE,  "normalizedGenes[g] <= ONE"  );
		}

        //------------------------------------------------------------
        // get the ranges...
        //------------------------------------------------------------
        let sequenceCountRange      = MAX_SEQUENCE_COUNT    - MIN_SEQUENCE_COUNT;
        let widthRange              = MAX_WIDTH             - MIN_WIDTH;
        let lengthRange             = MAX_LENGTH            - MIN_LENGTH;
        let ampRange                = MAX_AMP               - MIN_AMP;
        let frequencyRange          = MAX_FREQUENCY         - MIN_FREQUENCY;
        let phaseRange              = MAX_PHASE             - MIN_PHASE;
        let colorRange              = MAX_COLOR             - MIN_COLOR;
        let periodRange             = MAX_BRANCH_PERIOD     - MIN_BRANCH_PERIOD;
        let branchAngleRange        = MAX_BRANCH_ANGLE      - MIN_BRANCH_ANGLE;
        let branchNumberRange       = MAX_BRANCH_NUMBER     - MIN_BRANCH_NUMBER;
        let branchShiftRange        = MAX_BRANCH_SHIFT      - MIN_BRANCH_SHIFT;
        let branchCategoryRange     = MAX_BRANCH_CATEGORY   - MIN_BRANCH_CATEGORY;
        let branchReflectRange      = MAX_BRANCH_REFLECT    - MIN_BRANCH_REFLECT;
        let cutOffRange             = MAX_CUT_OFF           - MIN_CUT_OFF;
        let splinedRange            = MAX_SPLINED           - MIN_SPLINED;
        let endCapSplineRange       = MAX_END_CAP_SPLINE    - MIN_END_CAP_SPLINE;

        //---------------------------------
        // apply genes
        //---------------------------------
		let g = -1;
        
        g++; _frequency = MIN_FREQUENCY + frequencyRange    * _normalizedGenes[g];  _geneNames[g] = "frequency";
        g++; _cutOff    = MIN_CUT_OFF   + cutOffRange       * _normalizedGenes[g];  _geneNames[g] = "cutoff";
        
		for (let c=0; c<NUM_CATEGORIES; c++)
		{
		    _numGenesPerCategory = 0;
            g++; _categoryValues[c].startRed        = MIN_COLOR             + colorRange            * _normalizedGenes[g]; _numGenesPerCategory ++;  _geneNames[g] = "start red";
            g++; _categoryValues[c].startGreen      = MIN_COLOR             + colorRange            * _normalizedGenes[g]; _numGenesPerCategory ++;  _geneNames[g] = "start green";
            g++; _categoryValues[c].startBlue	    = MIN_COLOR             + colorRange            * _normalizedGenes[g]; _numGenesPerCategory ++;  _geneNames[g] = "start blue";
            g++; _categoryValues[c].endRed	        = MIN_COLOR             + colorRange            * _normalizedGenes[g]; _numGenesPerCategory ++;  _geneNames[g] = "end red";
            g++; _categoryValues[c].endGreen        = MIN_COLOR             + colorRange            * _normalizedGenes[g]; _numGenesPerCategory ++;  _geneNames[g] = "end green";
            g++; _categoryValues[c].endBlue         = MIN_COLOR             + colorRange            * _normalizedGenes[g]; _numGenesPerCategory ++;  _geneNames[g] = "end blue";
            g++; _categoryValues[c].startWidth      = MIN_WIDTH             + widthRange            * _normalizedGenes[g]; _numGenesPerCategory ++;  _geneNames[g] = "start width";
            g++; _categoryValues[c].endWidth        = MIN_WIDTH             + widthRange            * _normalizedGenes[g]; _numGenesPerCategory ++;  _geneNames[g] = "end width";
            g++; _categoryValues[c].startLength     = MIN_LENGTH            + lengthRange           * _normalizedGenes[g]; _numGenesPerCategory ++;  _geneNames[g] = "start length";
            g++; _categoryValues[c].endLength       = MIN_LENGTH            + lengthRange           * _normalizedGenes[g]; _numGenesPerCategory ++;  _geneNames[g] = "end length";

            g++; _categoryValues[c].amp             = MIN_AMP               + ampRange              * _normalizedGenes[g]; _numGenesPerCategory ++;  _geneNames[g] = "amplitude";
            g++; _categoryValues[c].phase           = MIN_PHASE             + phaseRange            * _normalizedGenes[g]; _numGenesPerCategory ++;  _geneNames[g] = "phase";
            g++; _categoryValues[c].turnAmp         = MIN_AMP               + ampRange              * _normalizedGenes[g]; _numGenesPerCategory ++;  _geneNames[g] = "turn amplitude";
            g++; _categoryValues[c].turnPhase       = MIN_PHASE             + phaseRange            * _normalizedGenes[g]; _numGenesPerCategory ++;  _geneNames[g] = "turn phase";
            g++; _categoryValues[c].branchAmp       = MIN_AMP               + ampRange              * _normalizedGenes[g]; _numGenesPerCategory ++;  _geneNames[g] = "branch amplitude";
            g++; _categoryValues[c].branchPhase     = MIN_PHASE             + phaseRange            * _normalizedGenes[g]; _numGenesPerCategory ++;  _geneNames[g] = "branch phase";
            g++; _categoryValues[c].branchTurnAmp   = MIN_AMP               + ampRange              * _normalizedGenes[g]; _numGenesPerCategory ++;  _geneNames[g] = "branch turn amplitude";
            g++; _categoryValues[c].branchTurnPhase = MIN_PHASE             + phaseRange            * _normalizedGenes[g]; _numGenesPerCategory ++;  _geneNames[g] = "branch turn phase";

            g++; _categoryValues[c].sequenceCount   = MIN_SEQUENCE_COUNT    + sequenceCountRange    * _normalizedGenes[g]; _numGenesPerCategory ++;  _geneNames[g] = "sequence count";
            g++; _categoryValues[c].branchPeriod    = MIN_BRANCH_PERIOD     + periodRange           * _normalizedGenes[g]; _numGenesPerCategory ++;  _geneNames[g] = "branch period";
            g++; _categoryValues[c].branchAngle     = MIN_BRANCH_ANGLE      + branchAngleRange      * _normalizedGenes[g]; _numGenesPerCategory ++;  _geneNames[g] = "branch angle";
            g++; _categoryValues[c].branchNumber    = MIN_BRANCH_NUMBER     + branchNumberRange     * _normalizedGenes[g]; _numGenesPerCategory ++;  _geneNames[g] = "branch number";
            g++; _categoryValues[c].branchShift     = MIN_BRANCH_SHIFT      + branchShiftRange      * _normalizedGenes[g]; _numGenesPerCategory ++;  _geneNames[g] = "branch shift";
            g++; _categoryValues[c].branchCategory  = MIN_BRANCH_CATEGORY   + branchCategoryRange   * _normalizedGenes[g]; _numGenesPerCategory ++;  _geneNames[g] = "branch category";
            g++; _categoryValues[c].branchReflect   = MIN_BRANCH_REFLECT    + branchReflectRange    * _normalizedGenes[g]; _numGenesPerCategory ++;  _geneNames[g] = "branch reflect";
            
            g++; _categoryValues[c].splined         = MIN_SPLINED           + splinedRange          * _normalizedGenes[g]; _numGenesPerCategory ++;  _geneNames[g] = "splined";
            g++; _categoryValues[c].endCapSpline    = MIN_END_CAP_SPLINE    + endCapSplineRange     * _normalizedGenes[g]; _numGenesPerCategory ++;  _geneNames[g] = "end cap spline";
         
            //---------------------------------------------------------------------------------------------
            // make these integers
            //---------------------------------------------------------------------------------------------
            _categoryValues[c].sequenceCount    = Math.floor( ZERO  + _categoryValues[c].sequenceCount  );
            _categoryValues[c].branchPeriod     = Math.floor( ZERO  + _categoryValues[c].branchPeriod   );
            _categoryValues[c].branchNumber     = Math.floor( ONE   + _categoryValues[c].branchNumber   );
            _categoryValues[c].branchShift      = Math.floor( ZERO  + _categoryValues[c].branchShift    );
            _categoryValues[c].branchCategory   = Math.floor( ZERO  + _categoryValues[c].branchCategory );
            _categoryValues[c].branchReflect    = Math.floor( ONE   + _categoryValues[c].branchReflect  );
            _categoryValues[c].splined          = Math.round( ZERO  + _categoryValues[c].splined        );
        }

        //-----------------------------------------------------------------------------------------
        // add genes for food type preference and digestibility:
        //
        // by default, swimbots are all born with a preferrence for 0 (green), but if numFoodTypes 
        // is set to 2, then they are born with a genetically-determined preferrence.
        //-----------------------------------------------------------------------------------------
        phenotype.preferredFoodType  = 0;
        phenotype.digestibleFoodType = 0;

        g++;  
        preferredFoodTypeGene = g; 
        _geneNames[g] = "preferred food type";
        if ( globalTweakers.numFoodTypes === 2 ) 
        {
            phenotype.preferredFoodType = Math.floor( _normalizedGenes[g] * 2 );     
        }   

        g++;  
        digestibleFoodTypeGene = g; 
        _geneNames[g] = "digestible food type";
        if ( globalTweakers.numFoodTypes === 2 ) 
        {
            phenotype.digestibleFoodType = Math.floor( _normalizedGenes[g] * 2 );     
        }   
        
        
        
        

        /*
        let preferredFoodType  = 0;
        let digestibleFoodType = 0;
        
        if ( globalTweakers.numFoodTypes === 2 )
        {            
            preferredFoodType  = Math.floor( _normalizedGenes[g] * 2 ); 
            digestibleFoodType = Math.floor( _normalizedGenes[g] * 2 ); 
        }

        g++;  phenotype.preferredFoodType  = preferredFoodType;  preferredFoodTypeGene  = g; _geneNames[g] = "preferred food type";
        g++;  phenotype.digestibleFoodType = digestibleFoodType; digestibleFoodTypeGene = g; _geneNames[g] = "digestible food type";
        */
        
        
        
        //---------------------------------------
        // important: set _numGenesUsed
        //---------------------------------------
        _numGenesUsed = g + 1;

        //---------------------------------------
        // make sure this is kosher
        //---------------------------------------
        //console.log( "num genes used = " + _numGenesUsed + " out of " + NUM_GENES );
		assert( _numGenesUsed < NUM_GENES, "embryology: _numGenesUsed < NUM_GENES" );
        
        //---------------------------------
        // set the frequency...
        //---------------------------------
        phenotype.frequency = _frequency;
        
        //----------------------------------------------
        // generate the first sequence...
        //----------------------------------------------
        _partIndex = ROOT_PART;
        let startCategory = 0;
        
testNoEel = true;
//console.log( "--------------");
        this.generateBodySequence( phenotype, _partIndex, ZERO, startCategory, ONE );  
testNoEel = false;  


        //----------------------------------------------
        // generate the rest of the body...
        //----------------------------------------------
        _generating = true;
        while ( _generating )
        {          
            for (let p=0; p<MAX_PARTS; p++)
            {
                _generating = false; // this might get set back to true in generateBodySequence
                
                //----------------------------------------------
                // branching...
                //----------------------------------------------
                if ( _branchStatus[p] )
                {        
                    _branchStatus[p] = false; // this might get set back to true in generateBodySequence
                    
                    let partCategory = phenotype.parts[p].category;              
                    
                    let c = _categoryValues[ partCategory ].branchCategory;
                    let reflect = ONE;

                    //--------------------------------------------
                    // grow branch 
                    //--------------------------------------------
                    if ( _categoryValues[c].branchNumber === 1 )
                    {
                        reflect = ONE; 
                        this.generateBodySequence( phenotype, p, _categoryValues[c].branchAngle, c, reflect );   
                    }
                    else
                    {
                        //---------------------------------------------------------------
                        // fan out branch angle across the range of branches....
                        //---------------------------------------------------------------
                        for (let b=0; b<_categoryValues[c].branchNumber; b++)
                        {
                            reflect = ONE; 
                            if ( b % _categoryValues[c].branchReflect === 0 )
                            {
                                reflect = -ONE;
                            }
                            
                            let f = -ONE + ( b / ( _categoryValues[c].branchNumber - 1 ) ) * 2;

                            this.generateBodySequence( phenotype, p, _categoryValues[c].branchAngle * f, c, reflect );    
                        }   
                    }                    
                }
            }
        }
        
        //------------------------------------------------------------------------
        // set num parts (it will have accumulated from generating part sequences)
        //------------------------------------------------------------------------
        phenotype.numParts = _partIndex + 1;
        
        assert( phenotype.numParts > 1, "phenotype.numParts > 1"  );

		//-----------------------------------------------------
		// re-order the parts for more sensible rendering 
		//-----------------------------------------------------
//this.fixPartOrdering( phenotype );

		//----------------------
		// return phenotype
		//----------------------
        return phenotype;
    }
    
    
    
	//-----------------------------------------------
	// re-order the body parts for proper rendering
	//-----------------------------------------------
	this.fixPartOrdering = function( phenotype )
	{
	    //--------------------------------------------------------------------------
	    //  copy the parts array into a backup array and call it "testParts"
	    //--------------------------------------------------------------------------
	    let fixed     = new Array();
	    let testParts = new Array();
	    
	    
	    phenotype.parts[2].red   = 1.0;
	    phenotype.parts[2].green = 1.0;
	    phenotype.parts[2].blue  = 0.5;

        for (let p=1; p<phenotype.numParts; p++)
		{
		    fixed[p] = false;
            testParts[p] = new Part();
		    copyPart( phenotype.parts[p], testParts[p] );
        }
	    
	    //---------------------------
	    // start with part 1
	    //---------------------------
        let currentParentIndex = 1;
	    fixed[ currentParentIndex ] = true;

//console.log( "" );		    
//console.log( "" );		    

	    //-----------------------------------------------------
	    // loop through the rest of the parts to replace them 
	    // with the copy...possibly in a different order)
	    //-----------------------------------------------------
        for (let p=1; p<phenotype.numParts; p++)
		{
//let r = phenotype.numParts - p;		    
//console.log( phenotype.numParts + ", " + p + ", " + r );		    
//copyPart( testParts[r], phenotype.parts[p] );
	
copyPart( testParts[p], phenotype.parts[p] );
	
	
	        /*
            //------------------------------------------------------
            // we need to loop through testParts to see if any 
            // part is a child of testParts[ currentParentIndex ]
            //------------------------------------------------------
            for (let o=1; o<phenotype.numParts; o++)
            {	     
                if ( testParts[o].parent === currentParentIndex )
                {
                    if ( ! fixed[o] )
                    {
                        if ( ! _branchStatus[o] )
                        {
                            copyPart( testParts[p], phenotype.parts[p] );
                            fixed[o] = true;
                            currentParentIndex = o;
                        }
                    }
                }
            }
            */
        }
    }
    
    
    
    
	//--------------------------------------
	// copy part
	//--------------------------------------
    function copyPart( from, to )
    {
        to.category			= from.category;
        to.position			= from.position;        
        to.velocity			= from.velocity;
        to.previousMid 		= from.previousMid;
        to.midPosition 		= from.midPosition;
        to.perpendicular	= from.perpendicular;
        to.bendingAngle		= from.bendingAngle;
        to.currentAngle		= from.currentAngle;

// do not use this
//to.parent = from.parent;

        to.mass				= from.mass;
        to.length			= from.length;
        to.width			= from.width;
        to.angle		    = from.angle;
        //to.branchAngle		= from.branchAngle;
        to.frequency		= from.frequency;
        to.amp			    = from.amp;
        to.phase		    = from.phase;
        to.turnAmp		    = from.turnAmp;
        to.turnPhase	    = from.turnPhase;
        to.momentFactor		= from.momentFactor;
        to.red				= from.red;
        to.green			= from.green;
        to.blue				= from.blue;
        to.splined          = from.splined;
        to.endCapSpline     = from.endCapSpline;
        to.numDecendents	= from.numDecendents;
        
        for (let d=0; d<MAX_PARTS; d++)
        {
            to.decendent[d] = from.decendent[d]; 
        }  
    }
    
    
	//---------------------------------------------------------------------------------
	// generate body sequence
	//---------------------------------------------------------------------------------
	this.generateBodySequence = function( phenotype, parent, branchAngle, c, reflect )
	{
        for (let i=0; i<_categoryValues[c].sequenceCount; i++)
        {
            if ( _partIndex < _cutOff )
            {        
                //-------------------------
                // increment _partIndex  
                //-------------------------
                _partIndex ++;               
                assert( _partIndex < MAX_PARTS, "_partIndex < MAX_PARTS" );
                
                phenotype.parts[ _partIndex ].child = NULL_INDEX; //default
            
                //-------------------------------------------------------
                // the first part is a branchpoint from the parent  
                //-------------------------------------------------------
                if ( i === 0 )
                {
                    phenotype.parts[ _partIndex ].branch    = true;
                    phenotype.parts[ _partIndex ].parent    = parent;
                    phenotype.parts[ _partIndex ].angle     = branchAngle; 
                    phenotype.parts[ _partIndex ].amp       = _categoryValues[c].branchAmp;
                    phenotype.parts[ _partIndex ].phase     = _categoryValues[c].branchPhase * _partIndex; 
                    phenotype.parts[ _partIndex ].turnAmp   = _categoryValues[c].branchTurnAmp;
                    phenotype.parts[ _partIndex ].turnPhase = _categoryValues[c].branchTurnPhase * _partIndex;   
                }
                else
                {
                    let parent = _partIndex - 1;
                    phenotype.parts[ parent ].child = _partIndex;
                
                    phenotype.parts[ _partIndex ].branch    = false;
                    phenotype.parts[ _partIndex ].parent    = parent;
                    phenotype.parts[ _partIndex ].angle     = ZERO;
                    phenotype.parts[ _partIndex ].amp       = _categoryValues[c].amp;
                    phenotype.parts[ _partIndex ].phase     = _categoryValues[c].phase * _partIndex; 
                    phenotype.parts[ _partIndex ].turnAmp   = _categoryValues[c].turnAmp;
                    phenotype.parts[ _partIndex ].turnPhase = _categoryValues[c].turnPhase;   
                }


                
if ( testNoEel )
{
    //console.log( "testNoEel" );
    phenotype.parts[ _partIndex ].turnAmp   = ZERO;
    phenotype.parts[ _partIndex ].turnPhase = ZERO;   
}
        
                //-----------------------------------------------
                // apply reflection on amp
                //-----------------------------------------------
                phenotype.parts[ _partIndex ].amp *= reflect;
                
                //---------------------------------------------------
                // set some other attributes  
                //---------------------------------------------------
                phenotype.parts[ _partIndex ].category      = c;
                phenotype.parts[ _partIndex ].frequency     = phenotype.frequency;
                phenotype.parts[ _partIndex ].splined       = _categoryValues[c].splined;
                phenotype.parts[ _partIndex ].endCapSpline  = _categoryValues[c].endCapSpline;
 
                //----------------------------------------------------
                // set attributes that interpolate over the sequence
                //----------------------------------------------------
                let fraction = ZERO;
                
                if ( _categoryValues[c].sequenceCount > 1 )
                {
                    fraction = i / ( _categoryValues[c].sequenceCount - 1 );     
                }
                        
                phenotype.parts[ _partIndex ].width  = _categoryValues[c].startWidth  + fraction * ( _categoryValues[c].endWidth  - _categoryValues[c].startWidth   );
                phenotype.parts[ _partIndex ].length = _categoryValues[c].startLength + fraction * ( _categoryValues[c].endLength - _categoryValues[c].startLength  );   
                phenotype.parts[ _partIndex ].red    = _categoryValues[c].startRed    + fraction * ( _categoryValues[c].endRed    - _categoryValues[c].startRed     );
                phenotype.parts[ _partIndex ].green  = _categoryValues[c].startGreen  + fraction * ( _categoryValues[c].endGreen  - _categoryValues[c].startGreen   );
                phenotype.parts[ _partIndex ].blue   = _categoryValues[c].startBlue   + fraction * ( _categoryValues[c].endBlue   - _categoryValues[c].startBlue    );
                
			    assert( phenotype.parts[ _partIndex ].length > ZERO, "In Embryology: phenotype.parts[ _partIndex ].length > ZERO" );
			    assert( phenotype.parts[ _partIndex ].width  > ZERO, "In Embryology: phenotype.parts[ _partIndex ].width  > ZERO" );              

                //---------------------------------------------------------------------------------
                // determine if there is a branching
                //---------------------------------------------------------------------------------
                let mod = ( i + _categoryValues[c].branchShift ) % _categoryValues[c].branchPeriod;
               
                if ( mod === 0 )
                {
                    _generating = true;
        		    _branchStatus[ _partIndex ] = true;
                }
            }   
        }
    }

   
	//--------------------------------
	// get num categories
	//--------------------------------
	this.getNumGeneCategories = function()
	{
	    return NUM_CATEGORIES;
	}
    
	//--------------------------------
	// get num genes used
	//--------------------------------
	this.getNumGenesUsed = function()
	{
	    return _numGenesUsed;
	}
    
	//--------------------------------
	// get num genes per category
	//--------------------------------
	this.getNumGenesPerCategory = function()
	{
	    return _numGenesPerCategory;
	}
    
   
	//--------------------------------
	// get gene name
	//--------------------------------
	this.getGeneName = function(g)
	{
	    return _geneNames[g];
	}
    
    
    
} // function Embryology()





	  
       


// === simulation/Brain.js ===
//--------------------------------------------------------------------------
//                                                                        
//    This file is part of GenePool Swimbots.                             
//    Copyright (c) 2021 by Jeffrey Ventrella - All Rights Reserved.      
//                                                                        
//    See the README file or go to swimbots.com for full license details.           
//    You may use, distribute, and modify this code only under the terms  
//    of the "Commons Clause" license (commonsclause.com).                
//                                                                        
//    This software is intended for education, game design, and research. 
//                                                                        
// -------------------------------------------------------------------------- 

"use strict";

//----------------------------------------
// states
//----------------------------------------
const BRAIN_STATE_NULL                = -1;
const BRAIN_STATE_RESTING             =  0;
const BRAIN_STATE_LOOKING_FOR_MATE    =  1;
const BRAIN_STATE_PURSUING_MATE       =  2;
const BRAIN_STATE_LOOKING_FOR_FOOD    =  3;
const BRAIN_STATE_PURSUING_FOOD       =  4;
const BRAIN_STATE_LOOKING_FOR_PREY    =  5;
const BRAIN_STATE_PURSUING_PREY       =  6;
const BRAIN_STATE_FLEEING_PREDATOR    =  7;
const NUM_BRAIN_STATES                =  8;

//--------------------------------------------
// perceiving
//--------------------------------------------
const BRAIN_SENSORY_UPDATE_PERIOD           = 50;
const BRAIN_MAX_PERCEIVED_NEARBY_SWIMBOTS   = 20;

//const BRAIN_FOCUS_TARGET_SHIFT_STRENGTH	    = 0.2;
const BRAIN_FOCUS_TARGET_SHIFT_STRENGTH	    = 0.1;
const BRAIN_FOCUS_TARGET_SHIFT_THRESHOLD    = 0.07;
const BRAIN_WANDER_AMOUNT					= 0.2;
//const BRAIN_WALL_BOUNCE_SHIFT_AMOUNT	    = 0.1;


//----------------------------------------
// Brain!
//----------------------------------------
function Brain()
{
	let _state                  = BRAIN_STATE_NULL;
	let _energy                 = ZERO;
	let _foundFoodBit           = false;
	let _foundSwimbot           = false;
	let _hungerThreshold        = ZERO;
	let _attractionCriterion    = ATTRACTION_SIMILAR_COLOR;
	
	
    //-----------------------------
    this.initialize = function()
    {
	    _state = BRAIN_STATE_NULL;
	    
	    /*
	    _energy                 = ZERO;
	    _foundFoodBit           = false;
	    _foundSwimbot           = false;
	    _hungerThreshold        = ZERO;
	    _attractionCriterion    = ATTRACTION_SIMILAR_COLOR;
	    */
    }

    //-----------------------
    this.update = function()
    {   
        //----------------------------------------------------------------------
        // if low energy, look for food, otherwise, look for sex
        //----------------------------------------------------------------------
        if ( _energy < _hungerThreshold )
        {
            if (( _state != BRAIN_STATE_PURSUING_FOOD )
            &&  ( _state != BRAIN_STATE_LOOKING_FOR_FOOD ))
            {
                _state = BRAIN_STATE_LOOKING_FOR_FOOD;
            }       
        }
        else 
        {
            if (( _state != BRAIN_STATE_PURSUING_MATE )
            &&  ( _state != BRAIN_STATE_LOOKING_FOR_MATE ))
            {
                _state = BRAIN_STATE_LOOKING_FOR_MATE;
            }        
        }
    
        //--------------------------------------------------------
        //  looking for food
        //--------------------------------------------------------
        if ( _state == BRAIN_STATE_LOOKING_FOR_FOOD )
        {
            if ( _foundFoodBit )
            {
                _state = BRAIN_STATE_PURSUING_FOOD;
            }
        }	      
        //--------------------------------------------------------
        //  pursuing food
        //--------------------------------------------------------
        else if ( _state == BRAIN_STATE_PURSUING_FOOD )
        {
            if ( !_foundFoodBit )
            {
                _state = BRAIN_STATE_LOOKING_FOR_FOOD;
            }
        }
        //--------------------------------------------------------
        //  Looking for mate
        //--------------------------------------------------------
        else if ( _state == BRAIN_STATE_LOOKING_FOR_MATE )
        {
            if ( _foundSwimbot )
            {
                _state = BRAIN_STATE_PURSUING_MATE;
            }
        }
        //--------------------------------------------------------
        //  pursuing mate
        //--------------------------------------------------------
        else if ( _state == BRAIN_STATE_PURSUING_MATE )
        {
            if ( !_foundSwimbot )
            {
                _state = BRAIN_STATE_LOOKING_FOR_MATE;
            }
        }

        //-----------------------------------------------------------------
        //  check for bogus brain state 
        //-----------------------------------------------------------------
        assert( _state < NUM_BRAIN_STATES, "_state < NUM_BRAIN_STATES" );        
        assert( _state > BRAIN_STATE_NULL, "_state > BRAIN_STATE_NULL" );
    }

    //-------------------------------------------------------------------
    // setters
    //-------------------------------------------------------------------
    this.setEnergyLevel     = function(e) { _energy              = e; }   
    this.setHungerThreshold = function(h) { _hungerThreshold     = h; }		
    this.setFoundFoodBit    = function(f) { _foundFoodBit        = f; }
    this.setFoundSwimbot    = function(f) { _foundSwimbot        = f; }		

    //--------------------------------
    this.setAttraction = function(a) 
    {
        //console.log( "setAttraction to " + a );
        
        _attractionCriterion = a; 

        // setting _foundSwimbot to false, causes the swimbot to search for a new potential mate
        _foundSwimbot = false;
    }


    //--------------------------------------------------------------------------
    // getters
    //--------------------------------------------------------------------------
    this.getHungerThreshold     = function() { return _hungerThreshold;     }	
    this.getAttractionCriterion = function() { return _attractionCriterion; }	
    this.getState               = function() { return _state;               }
}


// === simulation/SwimbotRenderer.js ===
//--------------------------------------------------------------------------
//                                                                        
//    This file is part of GenePool Swimbots.                             
//    Copyright (c) 2021 by Jeffrey Ventrella - All Rights Reserved.      
//                                                                        
//    See the README file or go to swimbots.com for full license details.           
//    You may use, distribute, and modify this code only under the terms  
//    of the "Commons Clause" license (commonsclause.com).                
//                                                                        
//    This software is intended for education, game design, and research. 
//                                                                        
// -------------------------------------------------------------------------- 

"use strict";

function SwimbotRenderer()
{

let    flopperX = 0;
let    flopperY = 0;
let    flopperXV = 0;
let    flopperYV = 0;
    
    //---------------------------------
    //  colors 
    //---------------------------------
    const COLOR_WHITENESS   = 0.4; // 0.0 = normal-saturated color; 0.5 = white-washed; 1.0 = pure white
    const DEAD_COLOR_RED    = 0.2;
    const DEAD_COLOR_GREEN  = 0.25;
    const DEAD_COLOR_BLUE   = 0.3;
    const ROLLOVER_COLOR    = "rgba( 180, 190, 200, 0.7 )";	
    const SELECT_COLOR      = "rgba( 255, 255, 255, 0.8 )";	
    const OUTLINE_COLOR     = "rgba( 0, 0, 0, 0.4 )";	
    
    //---------------------------------
    //  spline 
    //---------------------------------
    const DEFAULT_SPLINE_FACTOR = 0.4;

    //---------------------------------
    //  egg size 
    //---------------------------------
    const EGG_SIZE = 5.0;


	//--------------------------------
	// variables
	//--------------------------------
	let _colorUtility   = new Color();
	let _phenotype      = new Phenotype(); 
	let _growthScale    = ZERO;
	let _focusDirection = new Vector2D();
	let _brain          = new Brain();
	let _age            = 1000;
	let _energy         = ZERO;
	let _splineFactor   = ZERO;
	let _renderingGenitalsAndMouths = false;

	//----------------------------------------------------
	// get part parent position
	//----------------------------------------------------
	this.getPartParentPosition = function(p)
	{
		if ( _phenotype.parts[p].parent == NULL_PART )
		{
			return _phenotype.parts[0].position;
		}

		return _phenotype.parts[ _phenotype.parts[p].parent ].position;
	}


	//-------------------------------------------
	// set rendering goals
	//-------------------------------------------
	this.setRenderingGoals = function( r )
	{	
	    _renderingGenitalsAndMouths = r;
    }


	//-----------------------
	// render
	//-----------------------
	this.render = function
	( 
	    phenotype, 
	    brain, 
	    age,
	    energy,
	    growthScale, 
	    focusDirection, 
	    levelOfDetail 
	)
	{
    	_phenotype      = phenotype;
    	_brain          = brain;
    	_age            = age;
    	_energy         = energy;
    	_growthScale    = growthScale;
    	_focusDirection = focusDirection;
        
		if ( levelOfDetail == SWIMBOT_LEVEL_OF_DETAIL_DOT )
		{
		    let p = 1;

            _colorUtility = this.calculatePartColor(p);  
            
            let red   = Math.floor( _colorUtility.red   * 255 );
            let green = Math.floor( _colorUtility.green * 255 );
            let blue  = Math.floor( _colorUtility.blue  * 255 );

			canvas.fillStyle = "rgb( " + red + ", " + green + ", " + blue + " )";	
		    
            canvas.beginPath();
            canvas.arc( _phenotype.parts[p].position.x, _phenotype.parts[p].position.y, SWIMBOT_DOT_RENDER_RADIUS, 0, PI2, false );
            canvas.fill();
            canvas.closePath();	    
        }
		else if ( levelOfDetail == SWIMBOT_LEVEL_OF_DETAIL_LOW )
		{
			for (let p=1; p<_phenotype.numParts; p++)
			{
				let parentPosition = this.getPartParentPosition(p);
                
				_colorUtility = this.calculatePartColor(p);  
                let red   = Math.floor( _colorUtility.red   * 255 );
                let green = Math.floor( _colorUtility.green * 255 );
                let blue  = Math.floor( _colorUtility.blue  * 255 );

				canvas.strokeStyle = "rgb( " + red + ", " + green + ", " + blue + " )";	
				canvas.lineWidth = _phenotype.parts[p].width * 2.0; 

				canvas.beginPath();
				canvas.moveTo( parentPosition.x, parentPosition.y );
				canvas.lineTo( _phenotype.parts[p].position.x, _phenotype.parts[p].position.y );
				canvas.closePath();
				canvas.stroke();
			}	
		}
		else if ( levelOfDetail == SWIMBOT_LEVEL_OF_DETAIL_HIGH )
		{ 
			for (let p=1; p<_phenotype.numParts; p++)
			{
				if ( _phenotype.parts[p].length > ZERO )
				{
                    //--------------------------------------------
                    // render the part
                    //--------------------------------------------
				    
				    /*
                    if ( _phenotype.parts[p].splined )
                    {
                        _splineFactor = DEFAULT_SPLINE_FACTOR; 		
                    }
                    else
                    {
                        _splineFactor = 0.0;		
                    }

                    this.renderPartSplined(p);                    
                    */
                    

                    _splineFactor = DEFAULT_SPLINE_FACTOR; 	

                    if ( _phenotype.parts[p].splined )
                    {
                        this.renderPartSplined(p);
                    }
                    else
                    {
                        this.renderPartNormal(p);
                    }



                    //--------------------------------------------
                    // if p is mouth part, render mouth!
                    //--------------------------------------------
                    if ( p === 1 )
                    {
                        if ( _renderingGenitalsAndMouths )
                        {
                            if (( _brain.getState() == BRAIN_STATE_LOOKING_FOR_FOOD	)
                            ||  ( _brain.getState() == BRAIN_STATE_PURSUING_FOOD ))
                            {	
                                this.renderMouth();
                            }		
                        }
                    }			
					
					
				
/*
//testing floppy thing		
if ( _index === 0 )
{
    if ( p === 4 )
    {
        let xDiff = parentPosition.x - flopperX;
        let yDiff = parentPosition.y - flopperY;

        let length = Math.sqrt( xDiff * xDiff + yDiff * yDiff );
        
        let xDir = xDiff / length;
        let yDir = yDiff / length;
        
        let idealLength = 30.0;
        let lengthDiff = length - idealLength;
        
        let xForce = xDir * lengthDiff * 0.8;
        let yForce = yDir * lengthDiff * 0.8;

        flopperXV += xForce;
        flopperYV += yForce;

        flopperX += xForce;
        flopperY += yForce;

        flopperX += flopperXV;
        flopperY += flopperYV;
        
        flopperXV *= 0.99;
        flopperYV *= 0.99;

        canvas.fillStyle = "rgb( 200, 100, 100 )";	
        canvas.beginPath();
        canvas.moveTo( parentPosition.x, parentPosition.y );
        canvas.lineTo( flopperX, flopperY );
        canvas.lineTo( position.x, position.y );
        canvas.closePath();
        canvas.fill();
    }					
}					
*/

                    /*
					//------------------------------------------
					// show part mid position 
					//------------------------------------------
					canvas.fillStyle = "rgb( 244, 244, 244 )";	
					canvas.beginPath();
					canvas.arc( _phenotype.parts[p].midPosition.x, _phenotype.parts[p].midPosition.y, 0.05, 0, PI2, false );
					canvas.fill();
					canvas.closePath();	
					

					//------------------------------------------
					// show part velocity
					//------------------------------------------
					let scale = 12.0;
					canvas.strokeStyle = "rgb( 255, 255, 0 )";	
					canvas.beginPath();
					canvas.moveTo( _phenotype.parts[p].midPosition.x, _phenotype.parts[p].midPosition.y );
                    canvas.lineTo( _phenotype.parts[p].midPosition.x - _phenotype.parts[p].velocity.x * scale, _phenotype.parts[p].midPosition.y - _phenotype.parts[p].velocity.y * scale );
                    
                    // just show displacement of mid position
                    //canvas.lineTo( _phenotype.parts[p].previousMid.x, _phenotype.parts[p].previousMid.y );
					canvas.stroke();
					canvas.closePath();	

					//------------------------------------------
					// show part perpendicular
					//------------------------------------------
					scale = 10.0;
					canvas.strokeStyle = "rgb( 0, 255, 0 )";	
					canvas.beginPath();
					canvas.moveTo( _phenotype.parts[p].midPosition.x, _phenotype.parts[p].midPosition.y );
					canvas.lineTo( _phenotype.parts[p].midPosition.x + _phenotype.parts[p].perpendicular.x * scale, _phenotype.parts[p].midPosition.y + _phenotype.parts[p].perpendicular.y * scale );
					canvas.stroke();
					canvas.closePath();	
					*/
				}
			}
		}
		
        if ( _renderingGenitalsAndMouths )
		{
            //--------------------------------------------
            // render genital!
            //--------------------------------------------
            if (( _brain.getState() == BRAIN_STATE_LOOKING_FOR_MATE	)
            ||  ( _brain.getState() == BRAIN_STATE_PURSUING_MATE ))
            {	
                this.renderGenital();
            }
        }

	}// render funtion




	//-----------------------------------
	// render part normal (not splined)
	//-----------------------------------
	this.renderPartNormal = function(p)
	{			
        let width           = _phenotype.parts[p].width;
        let position 		= _phenotype.parts[p].position;
        let parentPosition  = this.getPartParentPosition(p);
        
        //---------------------------
        // baby growing...
        //---------------------------
        if ( _growthScale < ONE )        
        {
            width = width * _growthScale + EGG_SIZE * ( ONE - _growthScale );
        }

        let pp0x = _phenotype.parts[p].perpendicular.x * width;
        let pp0y = _phenotype.parts[p].perpendicular.y * width;

        let pp1x = _phenotype.parts[p].perpendicular.x * width;
        let pp1y = _phenotype.parts[p].perpendicular.y * width;

        let x0 = parentPosition.x - pp1x;
        let y0 = parentPosition.y - pp1y;

        let x1 = parentPosition.x + pp1x;
        let y1 = parentPosition.y + pp1y;

        let x2 = position.x + pp0x;
        let y2 = position.y + pp0y;

        let x3 = position.x - pp0x;
        let y3 = position.y - pp0y;		
    
        _colorUtility = this.calculatePartColor(p);
        let red   = Math.floor( _colorUtility.red   * 255 );
        let green = Math.floor( _colorUtility.green * 255 );
        let blue  = Math.floor( _colorUtility.blue  * 255 );

        canvas.fillStyle = "rgb( " + red + ", " + green + ", " + blue + " )";	

        canvas.beginPath();
        canvas.moveTo( x0, y0 );
        canvas.lineTo( x1, y1 );
        canvas.lineTo( x2, y2 );
        canvas.lineTo( x3, y3 );
        canvas.closePath();
        canvas.fill();
        
        let radius = width;

        canvas.beginPath();
        canvas.arc( position.x, position.y, radius, 0, PI2, false );
        canvas.fill();
        canvas.closePath();	

        canvas.beginPath();
        canvas.arc( parentPosition.x, parentPosition.y, radius, 0, PI2, false );								
        canvas.fill();
        canvas.closePath();	

        //--------------------------------
        // outline
        //--------------------------------
        canvas.lineWidth = 1.0; 
        canvas.strokeStyle = OUTLINE_COLOR

        let radian = _phenotype.parts[p].currentAngle * PI_OVER_180;

        canvas.beginPath();
        canvas.arc( parentPosition.x, parentPosition.y, radius, Math.PI - radian, Math.PI - radian + Math.PI, false );
        canvas.stroke();
        canvas.closePath();	    

        canvas.beginPath();
        canvas.moveTo( x1, y1 );
        canvas.lineTo( x2, y2 );
        canvas.arc( position.x, position.y, radius, -radian, -radian + Math.PI, false );
        canvas.moveTo( x0, y0 );
        canvas.lineTo( x3, y3 );
        canvas.stroke();
        canvas.closePath();	
    }






	//------------------------------------
	// render part splined 
	//------------------------------------
	this.renderPartSplined = function(p)
	{
	    let parentIndex     = _phenotype.parts[p].parent;
        let position 		= _phenotype.parts[p].position;
        let parentPosition  = this.getPartParentPosition(p);
        let width           = _phenotype.parts[p].width;
        let parentWidth     = _phenotype.parts[ parentIndex ].width;

        //---------------------------
        // baby growing...
        //---------------------------
        if ( _growthScale < ONE )        
        {
            width       = width         * _growthScale + EGG_SIZE * ( ONE - _growthScale );
            parentWidth = parentWidth   * _growthScale + EGG_SIZE * ( ONE - _growthScale );
        }

        let perpStartX  = _phenotype.parts[p].perpendicular.x;
        let perpStartY  = _phenotype.parts[p].perpendicular.y;
        let perpEndX    = _phenotype.parts[p].perpendicular.x;
        let perpEndY    = _phenotype.parts[p].perpendicular.y;

        let controlVectorLength = _phenotype.parts[p].length * _splineFactor;

        //-------------------------------------------------------------------------------
        // blend the two perpendiculars to represent the perpendicular of the joint
        //-------------------------------------------------------------------------------
        if (( p > 1 ) && ( ! _phenotype.parts[p].branch ))
        {
            perpStartX += _phenotype.parts[ parentIndex ].perpendicular.x;
            perpStartY += _phenotype.parts[ parentIndex ].perpendicular.y;
    
            let length = Math.sqrt( perpStartX * perpStartX + perpStartY * perpStartY );
            perpStartX /= length;
            perpStartY /= length;
        }

        
        if ( _phenotype.parts[p].child != NULL_INDEX )
        {
            perpEndX += _phenotype.parts[ _phenotype.parts[p].child ].perpendicular.x;
            perpEndY += _phenotype.parts[ _phenotype.parts[p].child ].perpendicular.y;

            let length = Math.sqrt( perpEndX * perpEndX + perpEndY * perpEndY );
            perpEndX /= length;
            perpEndY /= length;
        }

        //--------------------------------------
        // determine the two control vectors
        //--------------------------------------
        let control1DirectionX = -perpStartY;
        let control1DirectionY =  perpStartX;

        let control2DirectionX =  perpEndY;
        let control2DirectionY = -perpEndX;

        let control1VectorX = control1DirectionX * controlVectorLength;
        let control1VectorY = control1DirectionY * controlVectorLength;

        let control2VectorX = control2DirectionX * controlVectorLength;
        let control2VectorY = control2DirectionY * controlVectorLength;

        //--------------------------------------
        // scale the two perpendiculars
        //--------------------------------------
        perpEndX *= width;
        perpEndY *= width;

        if ( p === 1 ) 
        {
            perpStartX  *= width;
            perpStartY  *= width;
        }
        else
        {
            perpStartX  *= parentWidth;
            perpStartY  *= parentWidth;
        }

        //---------------------------------------------------------------------------------------
        // create the start and end points and the control points for the Bezier curve...
        //---------------------------------------------------------------------------------------
        let startLeftX      = parentPosition.x  - perpStartX;
        let startLeftY      = parentPosition.y  - perpStartY;
        let startRightX     = parentPosition.x  + perpStartX;
        let startRightY     = parentPosition.y  + perpStartY;
        let control1X       = parentPosition.x                  + control1VectorX;
        let control1Y       = parentPosition.y                  + control1VectorY;
        let control1LeftX   = parentPosition.x  - perpStartX    + control1VectorX;
        let control1LeftY   = parentPosition.y  - perpStartY    + control1VectorY;
        let control1RightX  = parentPosition.x  + perpStartX    + control1VectorX;
        let control1RightY  = parentPosition.y  + perpStartY    + control1VectorY;

        let endLeftX        = position.x        - perpEndX;
        let endLeftY        = position.y        - perpEndY;
        let endRightX       = position.x        + perpEndX;
        let endRightY       = position.y        + perpEndY;
        let control2X       = position.x                        + control2VectorX;
        let control2Y       = position.y                        + control2VectorY;
        let control2LeftX   = position.x        - perpEndX      + control2VectorX;
        let control2LeftY   = position.y        - perpEndY      + control2VectorY;
        let control2RightX  = position.x        + perpEndX      + control2VectorX;
        let control2RightY  = position.y        + perpEndY      + control2VectorY;


        //---------------------------------------
        // get color
        //---------------------------------------
        _colorUtility = this.calculatePartColor(p);
        let red   = Math.floor( _colorUtility.red   * 255 );
        let green = Math.floor( _colorUtility.green * 255 );
        let blue  = Math.floor( _colorUtility.blue  * 255 );

        canvas.fillStyle = "rgb( " + red + ", " + green + ", " + blue + " )";	
        canvas.strokeStyle = OUTLINE_COLOR;


        //---------------------------------------
        // the beginning of a series of parts
        //---------------------------------------
        if ( p === 1 )
        {
            canvas.beginPath();
            canvas.arc( _phenotype.parts[ parentIndex ].position.x, _phenotype.parts[ parentIndex ].position.y, width, 0, PI2, false );
            canvas.fill();
            canvas.closePath();	
            
            let radian = _phenotype.parts[ parentIndex ].currentAngle * PI_OVER_180;
            
            canvas.beginPath();
            canvas.arc
            ( 
                _phenotype.parts[ parentIndex ].position.x, 
                _phenotype.parts[ parentIndex ].position.y, 
                width, 
                
                Math.PI - radian, 
                Math.PI - radian + Math.PI, 
                
                false 
            );
            
            canvas.stroke();
            canvas.closePath();	    
        }

        //---------------------------------------
        // a terminating end part
        //---------------------------------------
        if ( _phenotype.parts[p].child === NULL_INDEX )
        {        
            let s =  width * _phenotype.parts[p].endCapSpline;
            let f = -1.0; // basically, a pixel's width...I think
            
            let axisNormalX = _phenotype.parts[p].axis.x / _phenotype.parts[p].length;
            let axisNormalY = _phenotype.parts[p].axis.y / _phenotype.parts[p].length;
            
//the perpendicular of the perpendicular!!!!            
//axisNormalX = -_phenotype.parts[p].perpendicular.y;
//axisNormalY =  _phenotype.parts[p].perpendicular.x;
            
            let startx  = endLeftX  + axisNormalX * f;
            let starty  = endLeftY  + axisNormalY * f;
            let endx    = endRightX + axisNormalX * f;
            let endy    = endRightY + axisNormalY * f;
            let c1x     = endLeftX  + axisNormalX * s;
            let c1y     = endLeftY  + axisNormalY * s;
            let c2x     = endRightX + axisNormalX * s;
            let c2y     = endRightY + axisNormalY * s;

            canvas.beginPath();
            canvas.moveTo( startx, starty );
            canvas.bezierCurveTo( c1x, c1y, c2x, c2y, endx, endy );
            canvas.closePath();	    
            canvas.fill();

            canvas.moveTo( startx, starty );
            canvas.bezierCurveTo( c1x, c1y, c2x, c2y, endx, endy );
            canvas.stroke();

            /*
            canvas.fillStyle = "rgb( 255, 255, 0 )";
            canvas.beginPath();
            canvas.arc( startx, starty, 1.5, 0, PI2, false );
            canvas.fill();
            canvas.closePath();	    

            canvas.fillStyle = "rgb( 255, 255, 0 )";
            canvas.beginPath();
            canvas.arc( endx, endy, 1.5, 0, PI2, false );
            canvas.fill();
            canvas.closePath();	    

            canvas.fillStyle = "rgb( 255, 0, 0 )";
            canvas.beginPath();
            canvas.arc( c1x, c1y, 0.5, 0, PI2, false );
            canvas.fill();
            canvas.closePath();	    

            canvas.fillStyle = "rgb( 255, 0, 0 )";
            canvas.beginPath();
            canvas.arc( c2x, c2y, 0.5, 0, PI2, false );
            canvas.fill();
            canvas.closePath();	    
            */


            /*
            canvas.beginPath();
            canvas.arc( position.x, position.y, width, 0, PI2, false );
            canvas.fill();
            canvas.closePath();	
            
            let radian = ( _phenotype.parts[p].currentAngle + 180 ) * PI_OVER_180;
            
            canvas.beginPath();
            canvas.arc( position.x, position.y, width, Math.PI - radian, Math.PI - radian + Math.PI, false );
            canvas.stroke();
            canvas.closePath();	 
            */
             
        }
        
        //---------------------------------------
        // fill interior
        //---------------------------------------
        canvas.beginPath();
        canvas.moveTo( startLeftX, startLeftY );
        canvas.bezierCurveTo( control1LeftX, control1LeftY, control2LeftX, control2LeftY, endLeftX, endLeftY );
        canvas.lineTo( endRightX, endRightY );
        canvas.bezierCurveTo( control2RightX, control2RightY, control1RightX, control1RightY, startRightX, startRightY );
        canvas.lineTo( startLeftX, startLeftY );
        canvas.closePath();	    
        canvas.fill();	

        canvas.beginPath();
        canvas.arc( parentPosition.x, parentPosition.y, parentWidth * 0.9, 0, PI2, false );								
        canvas.fill();
        canvas.closePath();	

        //---------------------------------------
        // draw outline
        //---------------------------------------
        canvas.lineWidth = 1.0;       	
        canvas.beginPath();
        canvas.moveTo( startLeftX, startLeftY );
        canvas.bezierCurveTo( control1LeftX, control1LeftY, control2LeftX, control2LeftY, endLeftX, endLeftY );
        canvas.moveTo( endRightX, endRightY );
        canvas.bezierCurveTo( control2RightX, control2RightY, control1RightX, control1RightY, startRightX, startRightY );
        canvas.stroke();								
        canvas.closePath();	



        /*
        canvas.fillStyle = "rgb( 0, 0, 0 )";
        canvas.beginPath();
        canvas.arc( position.x, position.y, 1.0, 0, PI2, false );
        canvas.fill();
        canvas.closePath();	    

        canvas.fillStyle = "rgb( 0, 0, 0 )";
        canvas.beginPath();
        canvas.arc( parentPosition.x, parentPosition.y, 1.0, 0, PI2, false );
        canvas.fill();
        canvas.closePath();	    
        */


        /*
        canvas.lineWidth = 0.5; 

        canvas.strokeStyle = "rgb( 255, 255, 255 )";
        canvas.beginPath();
        canvas.arc( startLeftX, startLeftY, 1.0, 0, PI2, false );
        canvas.stroke();
        canvas.closePath();	   					

        canvas.strokeStyle = "rgb( 255, 255, 255 )";
        canvas.beginPath();
        canvas.arc( startRightX, startRightY, 1.0, 0, PI2, false );
        canvas.stroke();
        canvas.closePath();	   					

        canvas.strokeStyle = "rgb( 255, 255, 255 )";
        canvas.beginPath();
        canvas.arc( endLeftX, endLeftY, 1.0, 0, PI2, false );
        canvas.stroke();
        canvas.closePath();	   					

        canvas.strokeStyle = "rgb( 255, 255, 255 )";
        canvas.beginPath();
        canvas.arc( endRightX, endRightY, 1.0, 0, PI2, false );
        canvas.stroke();
        canvas.closePath();	   					
        */


        /*
        canvas.fillStyle = "rgb( 255, 0, 255 )";
        canvas.beginPath();
        canvas.arc( control1X, control1Y, 0.5, 0, PI2, false );
        canvas.fill();
        canvas.closePath();	    

        canvas.fillStyle = "rgb( 255, 0, 255 )";
        canvas.beginPath();
        canvas.arc( control2X, control2Y, 0.5, 0, PI2, false );
        canvas.fill();
        canvas.closePath();	    

        canvas.fillStyle = "rgb( 255, 255, 0 )";
        canvas.beginPath();
        canvas.arc( control1LeftX, control1LeftY, 0.5, 0, PI2, false );
        canvas.fill();
        canvas.closePath();	    

        canvas.fillStyle = "rgb( 255, 255, 255 )";
        canvas.beginPath();
        canvas.arc( control1RightX, control1RightY, 0.5, 0, PI2, false );
        canvas.fill();
        canvas.closePath();	   					

        canvas.fillStyle = "rgb( 255, 255, 0 )";
        canvas.beginPath();
        canvas.arc( control2LeftX, control2LeftY, 0.5, 0, PI2, false );
        canvas.fill();
        canvas.closePath();	    

        canvas.fillStyle = "rgb( 255, 255, 255 )";
        canvas.beginPath();
        canvas.arc( control2RightX, control2RightY, 0.5, 0, PI2, false );
        canvas.fill();
        canvas.closePath();	   					
        */



        /*
        canvas.lineWidth = 0.5; 
        canvas.strokeStyle = "rgba( 100, 255, 100, 0.9 )";
        canvas.beginPath();
        canvas.moveTo( parentPosition.x, parentPosition.y );
        canvas.bezierCurveTo( control1X, control1Y, control2X, control2Y, position.x, position.y );
        canvas.stroke();								


        canvas.lineWidth = 0.5; 
        canvas.strokeStyle = "rgba( 100, 255, 100, 0.9 )";
        canvas.beginPath();
        canvas.moveTo( startLeftX, startLeftY );
        canvas.bezierCurveTo( control1LeftX, control1LeftY, control2LeftX, control2LeftY, endLeftX, endLeftY );
        canvas.stroke();								

        canvas.lineWidth = 0.5; 
        canvas.strokeStyle = "rgba( 100, 255, 100, 0.9 )";
        canvas.beginPath();
        canvas.moveTo( startRightX, startRightY );
        canvas.bezierCurveTo( control1RightX, control1RightY, control2RightX, control2RightY, endRightX, endRightY );
        canvas.stroke();								
        */

        // show main axis
        /*
        canvas.lineWidth = 0.5; 
        canvas.strokeStyle = "rgba( 100, 100, 200, 0.6 )";
        canvas.beginPath();
        canvas.moveTo( parentPosition.x, parentPosition.y );
        canvas.lineTo( position.x, position.y );
        canvas.stroke();								
        */


        // show block outline
        /*
        canvas.lineWidth = 0.5; 
        canvas.strokeStyle = "rgba( 100, 0, 0, 0.6 )";
        canvas.beginPath();
        canvas.moveTo( startLeftX, startLeftY );
        canvas.lineTo( startRightX, startRightY );
        canvas.stroke();								

        canvas.lineWidth = 0.5; 
        canvas.strokeStyle = "rgba( 100, 0, 0, 0.6 )";
        canvas.beginPath();
        canvas.moveTo( startRightX, startRightY );
        canvas.lineTo( endRightX,   endRightY   );
        canvas.stroke();								

        canvas.lineWidth = 0.5; 
        canvas.strokeStyle = "rgba( 100, 0, 0, 0.6 )";
        canvas.beginPath();
        canvas.moveTo( endRightX,   endRightY   );
        canvas.lineTo( endLeftX,    endLeftY    );
        canvas.stroke();								

        canvas.lineWidth = 0.5; 
        canvas.strokeStyle = "rgba( 100, 0, 0, 0.6 )";
        canvas.beginPath();
        canvas.moveTo( endLeftX,    endLeftY   );
        canvas.lineTo( startLeftX,  startLeftY  );
        canvas.stroke();								
        */
    }




	//------------------------------------------------------
	// calculate part color 
	//------------------------------------------------------
	this.calculatePartColor = function(p)
	{
	    _colorUtility.red   = _phenotype.parts[p].red;
	    _colorUtility.green = _phenotype.parts[p].green;
	    _colorUtility.blue  = _phenotype.parts[p].blue;
        
        if ( _age < globalTweakers.maximumLifeSpan - OLD_AGE_DURATION )
        {
            if ( _age < YOUNG_AGE_DURATION )
            {
                //------------------------------
                // newborns start white...
                //------------------------------
                _colorUtility.red   = ( ONE - _growthScale ) + ( _colorUtility.red	 * _growthScale );
                _colorUtility.green = ( ONE - _growthScale ) + ( _colorUtility.green * _growthScale );
                _colorUtility.blue  = ( ONE - _growthScale ) + ( _colorUtility.blue	 * _growthScale );
            }
            else
            {
                if ( _energy < STARVING )
                {
                    assert( _energy >= ZERO, "_energy >= ZERO" );

                    let f = ONE - ( _energy / STARVING );
            
                    _colorUtility.red   = DEAD_COLOR_RED    * f + _phenotype.parts[p].red   * ( ONE - f );
                    _colorUtility.green = DEAD_COLOR_GREEN  * f + _phenotype.parts[p].green * ( ONE - f );
                    _colorUtility.blue  = DEAD_COLOR_BLUE   * f + _phenotype.parts[p].blue  * ( ONE - f );
                 }
            }
        }
        else
        {
            let oldAgeThreshold = globalTweakers.maximumLifeSpan - OLD_AGE_DURATION;
        
            let f = ( _age - oldAgeThreshold ) / OLD_AGE_DURATION;
            
            assert( f >= ZERO, "SwibotRenderer:renderPartSplined: f >= ZERO" );
            assert( f <= ONE,  "SwibotRenderer:renderPartSplined: f <= ONE"  );
        
            // I had an assert before, but this is just graphics, and 
            // I assume if it is above 1, it's only by a tiny amount.
            if ( f > ONE )
            {
                f = ONE;
            }
        
            _colorUtility.red   = DEAD_COLOR_RED    * f + _phenotype.parts[p].red   * ( ONE - f );
            _colorUtility.green = DEAD_COLOR_GREEN  * f + _phenotype.parts[p].green * ( ONE - f );
            _colorUtility.blue  = DEAD_COLOR_BLUE   * f + _phenotype.parts[p].blue  * ( ONE - f );
        }
        
        assert( _colorUtility.red   >= ZERO, "_colorUtility.red   >= ZERO" );
        assert( _colorUtility.red   <= ONE,  "_colorUtility.red   <= ONE"  );

        assert( _colorUtility.green >= ZERO, "_colorUtility.green >= ZERO" );
        assert( _colorUtility.green <= ONE,  "_colorUtility.green <= ONE"  );

        assert( _colorUtility.blue  >= ZERO, "_colorUtility.blue  >= ZERO" );
        assert( _colorUtility.blue  <= ONE,  "_colorUtility.blue  <= ONE"  );
        
	    return _colorUtility;
	}




    
	//--------------------------------
	// render genital
	//--------------------------------
	this.renderGenital = function()
	{	
        let genitalLength = SWIMBOT_GENITAL_LENGTH * _growthScale;
        
        let x = _phenotype.parts[ GENITAL_INDEX ].position.x + _focusDirection.x * genitalLength;
        let y = _phenotype.parts[ GENITAL_INDEX ].position.y + _focusDirection.y * genitalLength;
        
		canvas.lineWidth = 1.0; 
        canvas.strokeStyle = "rgba( 255, 255, 255, 0.7 )";	
        canvas.beginPath();
        canvas.moveTo( _phenotype.parts[ GENITAL_INDEX ].position.x, _phenotype.parts[ GENITAL_INDEX ].position.y );
        canvas.lineTo( x, y );
        canvas.stroke();
        canvas.closePath();			
        
        //--------------------------------------------------------
        // if pursuing a mate, show arrow head
        //--------------------------------------------------------
        if ( _brain.getState() === BRAIN_STATE_PURSUING_MATE )
        {
            let arrowLength = genitalLength * 0.4;
            let arrowWidth  = genitalLength * 0.25;
            let xLeft  = x - _focusDirection.y * arrowWidth - _focusDirection.x * arrowLength;
            let yLeft  = y + _focusDirection.x * arrowWidth - _focusDirection.y * arrowLength;

            let xRight = x + _focusDirection.y * arrowWidth - _focusDirection.x * arrowLength;
            let yRight = y - _focusDirection.x * arrowWidth - _focusDirection.y * arrowLength;
            
            canvas.beginPath();
            canvas.moveTo( xLeft, yLeft );
            canvas.lineTo( x, y );
            canvas.lineTo( xRight, yRight );
            canvas.stroke();
            canvas.closePath();			
        }
	}





	//--------------------------------
	// render mouth
	//--------------------------------
	this.renderMouth = function()
	{		    
// older version	
/*
let mouthLength = SWIMBOT_MOUTH_LENGTH * _growthScale;
let mouthEndX = _phenotype.parts[ MOUTH_INDEX ].position.x + _focusDirection.x * mouthLength;
let mouthEndY = _phenotype.parts[ MOUTH_INDEX ].position.y + _focusDirection.y * mouthLength;

canvas.lineWidth = SWIMBOT_MOUTH_WIDTH; 
canvas.strokeStyle = "rgb( 50, 200, 50 )";	

//--------------------------------------------------------
// if pursuing a food bit, show jaws
//--------------------------------------------------------
if ( _brain.getState() === BRAIN_STATE_PURSUING_FOOD )
{
    let px = _focusDirection.y * mouthLength * 0.4;
    let py = _focusDirection.x * mouthLength * 0.4;
    let fx = _focusDirection.x * mouthLength * 0.6;
    let fy = _focusDirection.y * mouthLength * 0.6;
    
    let leftJawX  = mouthEndX - px + fx;
    let leftJawY  = mouthEndY + py + fy;
    let rightJawX = mouthEndX + px + fx;
    let rightJawY = mouthEndY - py + fy;

    canvas.beginPath();            
    canvas.moveTo( leftJawX,  leftJawY  );
    canvas.lineTo( _phenotype.parts[ MOUTH_INDEX ].position.x, _phenotype.parts[ MOUTH_INDEX ].position.y );
    canvas.lineTo( rightJawX, rightJawY );
    canvas.stroke();
    canvas.closePath();		
}
else
{
    canvas.beginPath();
    canvas.moveTo( _phenotype.parts[ MOUTH_INDEX ].position.x, _phenotype.parts[ MOUTH_INDEX ].position.y );
    canvas.lineTo( mouthEndX, mouthEndY );
    canvas.stroke();
    canvas.closePath();						
}	
*/        
        // new version
        
	    let mouthLength = _phenotype.parts[1].width * 2.5;
	    if ( mouthLength < SWIMBOT_MIN_MOUTH_LENGTH )
	    {
	        mouthLength = SWIMBOT_MIN_MOUTH_LENGTH;
	    }
	    	    
	    let mouthWidth = _phenotype.parts[1].width;
	    if ( mouthWidth < SWIMBOT_MIN_MOUTH_WIDTH )
	    {
	        mouthWidth = SWIMBOT_MIN_MOUTH_WIDTH;
	    }
	    
	    mouthLength *= _growthScale;
	    mouthWidth  *= _growthScale;
	    
	    let baseX = _phenotype.parts[ MOUTH_INDEX ].position.x;
	    let baseY = _phenotype.parts[ MOUTH_INDEX ].position.y;

        let mouthStartX = baseX + _focusDirection.x * mouthLength * 0.3;
        let mouthStartY = baseY + _focusDirection.y * mouthLength * 0.3;

        let mouthEndX = baseX + _focusDirection.x * mouthLength;
        let mouthEndY = baseY + _focusDirection.y * mouthLength;
        
        let basePerpX =  _focusDirection.y * _phenotype.parts[1].width * 0.5;
        let basePerpY = -_focusDirection.x * _phenotype.parts[1].width * 0.5;

        let endPerpX  =  _focusDirection.y * mouthWidth;
        let endPerpY  = -_focusDirection.x * mouthWidth;
        
        let leftJawX  = baseX - basePerpX;
        let leftJawY  = baseY - basePerpY;
        let rightJawX = baseX + basePerpX;
        let rightJawY = baseY + basePerpY;
        
        let leftEndX  = mouthEndX;
        let leftEndY  = mouthEndY;
        let rightEndX = mouthEndX;
        let rightEndY = mouthEndY;
            
		canvas.lineWidth = SWIMBOT_MOUTH_WIDTH; 
        
        _colorUtility = this.calculatePartColor(1);  
        let red   = Math.floor( _colorUtility.red   * 255 );
        let green = Math.floor( _colorUtility.green * 255 );
        let blue  = Math.floor( _colorUtility.blue  * 255 );
        
        canvas.fillStyle = "rgb( " + red + ", " + green + ", " + blue + " )";	
        
        //--------------------------------------------------------
        // open jaws
        //--------------------------------------------------------
        if ( _brain.getState() === BRAIN_STATE_PURSUING_FOOD )
        {
            leftEndX  -= endPerpX;
            leftEndY  -= endPerpY;
            rightEndX += endPerpX;
            rightEndY += endPerpY;
        }        

        canvas.beginPath();
        canvas.moveTo( mouthStartX, mouthStartY );
        canvas.lineTo( leftJawX,    leftJawY    );
        canvas.lineTo( leftEndX,    leftEndY    );
        canvas.lineTo( mouthStartX, mouthStartY );
        canvas.lineTo( rightEndX,   rightEndY   );
        canvas.lineTo( rightJawX,   rightJawY   );
        canvas.lineTo( leftJawX,    leftJawY    );
        canvas.fill();
        canvas.closePath();	
        
        canvas.strokeStyle = "rgba( 255, 255, 255, 0.7 )";	
        canvas.beginPath();
        canvas.moveTo( rightEndX,   rightEndY  );
        canvas.lineTo( mouthStartX, mouthStartY );
        canvas.lineTo( leftEndX,    leftEndY );
        canvas.stroke();
        canvas.closePath();	     
               					
        canvas.strokeStyle = OUTLINE_COLOR; 
        canvas.beginPath();
        canvas.moveTo( leftJawX, leftJawY );
        canvas.lineTo( leftEndX, leftEndY );
        canvas.stroke();
        canvas.closePath();	            					

        canvas.beginPath();
        canvas.moveTo( rightJawX, rightJawY );
        canvas.lineTo( rightEndX, rightEndY );
        canvas.stroke();
        canvas.closePath();	 
                   					
    }
    
}//end of entire Swimbots function -------------------------







// === simulation/Swimbot.js ===
//--------------------------------------------------------------------------
//                                                                        
//    This file is part of GenePool Swimbots.                             
//    Copyright (c) 2021 by Jeffrey Ventrella - All Rights Reserved.      
//                                                                        
//    See the README file or go to swimbots.com for full license details.           
//    You may use, distribute, and modify this code only under the terms  
//    of the "Commons Clause" license (commonsclause.com).                
//                                                                        
//    This software is intended for education, game design, and research. 
//                                                                        
// -------------------------------------------------------------------------- 

"use strict";

function Swimbot()
{

let    flopperX = 0;
let    flopperY = 0;
let    flopperXV = 0;
let    flopperYV = 0;


    //---------------------------------
    //  attraction 
    //---------------------------------
    const TOO_UGLY_TO_CHOOSE = ZERO;
    
    //---------------------------------
    //  colors 
    //---------------------------------
    
    // I believe all of these have been moved over to swimbot renderer...
    /*
    const COLOR_WHITENESS   = 0.4; // 0.0 = normal-saturated color; 0.5 = white-washed; 1.0 = pure white
    const DEAD_COLOR_RED    = 0.2;
    const DEAD_COLOR_GREEN  = 0.25;
    const DEAD_COLOR_BLUE   = 0.3;
    const ROLLOVER_COLOR    = "rgba( 180, 190, 200, 0.7 )";	
    const SELECT_COLOR      = "rgba( 255, 255, 255, 0.8 )";	
    const OUTLINE_COLOR     = "rgba( 0, 0, 0, 0.4 )";	
    */
    
	//-----------------------------------------
	// variables
	//-----------------------------------------
	let _genotype		    = new Genotype(); 
	let _phenotype		    = new Phenotype(); 
	let _brain  		    = new Brain();
	let _position 		    = new Vector2D();
	let _velocity 		    = new Vector2D();
	let _acceleration       = new Vector2D();
	let _heading		    = new Vector2D();
	let _directionToGoal    = new Vector2D();
	let _focusDirection	    = new Vector2D();
	let _centerOfMass	    = new Vector2D();
	let _vectorUtility      = new Vector2D();
	let _chosenFoodBit      = new FoodBit();
	let _swimbotRenderer  	= new SwimbotRenderer(); 
	let _chosenMate         = null; // must start as null!
	let _age 	  		    = 0;
	let _numOffspring       = 0;
	let _numFoodBitsEaten   = 0;
	//let _maximumLifeSpan    = 0;
	let _index              = NULL_INDEX;
	let _chosenMateIndex    = NULL_INDEX;
	let _chosenFoodBitIndex = NULL_INDEX;
	let _alive 	  		    = false;
	let _tryingToMate       = false;
	let _tryingToEat        = false;
	let _growthScale        = ZERO;
	let _torque             = ZERO;
	let _angle			    = ZERO;
	let _spin			    = ZERO;
	let _energy			    = ZERO;
	let _timer              = ZERO;
	let _timerDelta         = ZERO;
	let _colorUtility       = new Color();
	let _energyEfficiency   = ZERO;
	let _selectRadius       = ZERO;
	let _species            = NULL_INDEX;
	
	let _lastPositionForEfficiencyMeasurement = new Vector2D();
    let _lastEnergyForEfficiencyMeasurement = ZERO;
	let _readyforSensoryInputToBrain = false;


let _parent = null;	

//----------------------------------
this.setParent = function( parent )
{
    _parent = parent;
}
    
    //------------------------------------
    this.computeMomentFactors = function()
    {
        this.determinePartDecendents();

        let oneOverMass = ONE / _phenotype.mass;

        for (let p=2; p<_phenotype.numParts; p++)
        {
            let moment = _phenotype.parts[p].mass * oneOverMass;

            for (let d=1; d<=_phenotype.parts[p].numDecendents; d++)
            {
                let decendent = _phenotype.parts[p].decendent[d];
                moment += _phenotype.parts[ decendent ].mass * oneOverMass;
            }

            _phenotype.parts[p].momentFactor = moment;
        }
     }

	//-----------------------------------------
	// update body parts
	//-----------------------------------------
	this.updateBodyParts = function()
	{
        let oldAgeThreshold = globalTweakers.maximumLifeSpan - OLD_AGE_DURATION;

        //----------------------------------
        // swimmer is not old yet
        //----------------------------------
        if ( _age < oldAgeThreshold )
        {	
            if ( _age < YOUNG_AGE_DURATION )
            {
                //----------------------------------
                // swimmer is still growing
                //----------------------------------
                _growthScale = _age / YOUNG_AGE_DURATION;
            }
            else
            {
                _growthScale = ONE;
            }

            assert( _growthScale >= 0.0, "assert swimbot.js:updateBodyParts: _growthScale >= 0.0" )
            assert( _growthScale <= 1.0, "assert swimbot.js:updateBodyParts: _growthScale <= 1.0" )    
    
            //---------------------------------------
            // slowing down because starving, 
            // but not slowing down to a full stop.
            //---------------------------------------
            if  ( _energy < STARVING )
            {      
                _timerDelta = _energy / STARVING;
        
                if ( _timerDelta < STARVING_TIMER_DELTA )
                {
                    _timerDelta = STARVING_TIMER_DELTA;
                }                
            }
            else
            {
                _timerDelta += TIMER_DELTA_INCREASE_RATE;
       
                if ( _timerDelta > ONE )
                {
                    _timerDelta = ONE; 
                }
            }
        }
        else 
        //----------------------------------
        // swimmer is past old age threshold
        //----------------------------------
        {
            //----------------------------------
            // dying of old age
            //----------------------------------
            if ( _age > globalTweakers.maximumLifeSpan ) 
            {
                this.die();
            }
            else 
            {     
                //----------------------------------
                // slowing down because dying
                //----------------------------------
                //let earlyDeath = 200;
                //earlyDeath = 0;
                //let inc = ( _age - OLD_AGE ) / ( oldAgeDuration - earlyDeath );
                
                //let inc = ( _age - OLD_AGE ) / oldAgeDuration;
                
                /*
                if ( inc > ONE )
                {
                    inc = ONE;
                }
                */
                
                _timerDelta = ONE - ( _age - oldAgeThreshold ) / OLD_AGE_DURATION;     
                
                assert( _timerDelta >= 0.0, "assert swimbot.js:updateBodyParts: _timerDelta >= 0.0" )
                assert( _timerDelta <= 1.0, "assert swimbot.js:updateBodyParts: _timerDelta <= 1.0" )    
            }
        }

        _timer += _timerDelta;
	
		//---------------------------------------------------------------
		// calculate the modulators as a function of the dot between the 
		// heading and the perpendicular of the direction to the goal
		//---------------------------------------------------------------
		let radian = _angle * PI_OVER_180;

		_heading.x = Math.sin( radian );
		_heading.y = Math.cos( radian );

		let perpX =  _heading.y;
		let perpY = -_heading.x;
				
        let directionDot = _focusDirection.x * perpX + _focusDirection.y * perpY;

//test
//let perpDot      = _focusDirection.x * _heading.x + _focusDirection.y * _heading.y;

		//-----------------------------------------------------------------
		// set root position and angle
		//-----------------------------------------------------------------
		_phenotype.parts[ ROOT_PART ].position.set( _position );
		_phenotype.parts[ ROOT_PART ].currentAngle = _angle - this.getMomentAdjustment();

		//-----------------------------------------------------------------
		// loop through parts to determine angle and position
		//-----------------------------------------------------------------
		for (let p=1; p<_phenotype.numParts; p++)
		{
			_phenotype.parts[p].position.set( this.getPartParentPosition(p) );

			//-----------------------------------
			// determine current angle
			//-----------------------------------
			_phenotype.parts[p].currentAngle = 
			_phenotype.parts[ _phenotype.parts[p].parent ].currentAngle + 
			_phenotype.parts[p].angle;
			
			//-----------------------------------
			// add motion
			//-----------------------------------
			if ( p > 1 ) // because part 1 has nothing to 'bend' off of 
			{
				let ampModulator   = _phenotype.parts[p].turnAmp    * directionDot;
				let phaseModulator = _phenotype.parts[p].turnPhase  * directionDot;	
			
/*			
//reversable stroke version
let perpAmpModulator   = _phenotype.parts[p].amp    * perpDot;
let perpPhaseModulator = _phenotype.parts[p].phase  * perpDot;	
            
let radian = _timer * _phenotype.frequency + ( perpPhaseModulator + phaseModulator );	
_phenotype.parts[p].bendingAngle = ( perpAmpModulator + ampModulator ) * Math.sin( radian );
*/

				let radian = _timer * _phenotype.frequency + ( _phenotype.parts[p].phase + phaseModulator );	
				_phenotype.parts[p].bendingAngle = ( _phenotype.parts[p].amp + ampModulator ) * Math.sin( radian );

				_phenotype.parts[p].currentAngle += _phenotype.parts[p].bendingAngle;
			}

			//-----------------------------------
			// determine position
			//-----------------------------------
			let radian = _phenotype.parts[p].currentAngle * PI_OVER_180;
			let length = _phenotype.parts[p].length;
			
			if ( _age < YOUNG_AGE_DURATION ) 
			{
                length *= _growthScale;
			}
						
			let x = length * Math.sin( radian );
			let y = length * Math.cos( radian );
			_phenotype.parts[p].previousMid.setXY( _phenotype.parts[p].midPosition.x, _phenotype.parts[p].midPosition.y );
			_phenotype.parts[p].midPosition.setXY( _phenotype.parts[p].position.x, _phenotype.parts[p].position.y );
			_phenotype.parts[p].position.addXY( x, y );
			_phenotype.parts[p].midPosition.addXY( x * ONE_HALF, y * ONE_HALF );
			
		    //---------------------------------------------------------
		    // get part axis
		    //---------------------------------------------------------
            _phenotype.parts[p].axis.x = _phenotype.parts[p].position.x - _phenotype.parts[ _phenotype.parts[p].parent ].position.x;
            _phenotype.parts[p].axis.y = _phenotype.parts[p].position.y - _phenotype.parts[ _phenotype.parts[p].parent ].position.y;
            
		    //---------------------------------------------------------
		    // get perpendicular of part axis
		    //---------------------------------------------------------
            _phenotype.parts[p].perpendicular.setXY( _phenotype.parts[p].axis.y / length, -_phenotype.parts[p].axis.x / length );
			
			//-------------------------------------------------------------------------------------------------------
			// calculate part velocity now
			//-------------------------------------------------------------------------------------------------------
            _phenotype.parts[p].velocity.setToDifference( _phenotype.parts[p].midPosition, _phenotype.parts[p].previousMid );
            
            //console.log( _phenotype.parts[p].velocity.x + ", " + _phenotype.parts[p].velocity.y );
		}
	

		//-----------------------------
		// calculate center of mass
		//-----------------------------
		this.calculateCenterOfMass();

		//-----------------------------------------
		// here is where I shift all my body nodes
		// to keep my center of mass in place...
		//-----------------------------------------
        this.adjustToCenterOfMass();

		//------------------------------------
		// I need to do this again because I 
		// just did an adjustToCenterOfMass
		//------------------------------------
		this.calculateCenterOfMass();
		
		//----------------------------------------
		// calculate select radius
		// 
		// (this is a weird hacky solution)
		//----------------------------------------
		if ( _age % 20 === 0 )
		{
            for (let p=1; p<_phenotype.numParts; p++)
            {
                for (let o=1; o<_phenotype.numParts; o++)
                {
                    if ( o != p )
                    {	    	    
                        let distance = _phenotype.parts[p].position.getDistanceTo( _phenotype.parts[o].position );
                        
                        distance = SWIMBOT_SELECT_RADIUS_SCALAR * Math.sqrt( distance );
                        
                        if ( distance > _selectRadius )
                        {
                            _selectRadius = distance;
                        }
                    }
                }	
            }	
		}
	}




    //------------------------------------
    this.getMomentAdjustment = function()
    {
        let momentAdjustment = ZERO;

        //--------------------------------
        // part 1 is not involved here.. 
        //--------------------------------
        for (let p=2; p<_phenotype.numParts; p++)
        {
            momentAdjustment += _phenotype.parts[p].bendingAngle * _phenotype.parts[p].momentFactor;
        }

        return momentAdjustment;
     }


	//--------------------------------
	// calculate center of mass
	//--------------------------------
	this.calculateCenterOfMass = function()
	{
		_centerOfMass.clear();
		 
		for (let p=1; p<_phenotype.numParts; p++ )
		{
			_centerOfMass.addScaled( _phenotype.parts[p].midPosition, _phenotype.parts[p].mass );
		}
	  
		_centerOfMass.scale( ONE / _phenotype.mass );
	}

	//--------------------------------
	// adjust to center of mass
	//--------------------------------
	this.adjustToCenterOfMass = function()
	{
		let offsetX = _position.x - _centerOfMass.x;
		let offsetY = _position.y - _centerOfMass.y;
	 
		for (let  p=0; p<_phenotype.numParts; p++ )
		{
		   _phenotype.parts[p].position.addXY	( offsetX, offsetY );
		   _phenotype.parts[p].midPosition.addXY( offsetX, offsetY );
		}
	}



	//------------------------------------------
	// determine part decendents
	//------------------------------------------
	this.determinePartDecendents = function()
	{
		//-----------------------------------------------------------
		// The purpose of this function is to determine all 
		// the "child" parts that descend from each part....   
		//-----------------------------------------------------------
		for (let p=1; p<_phenotype.numParts; p++)
		{
			_phenotype.parts[p].numDecendents = 0;

			//-----------------------------------------------------------
			// loop through all parts as potential decendents...
			//-----------------------------------------------------------
			for (let potentialDecendent  = 1; 
					 potentialDecendent < _phenotype.numParts; 
					 potentialDecendent ++)
			{
				let testing = true;
				let root = potentialDecendent;

				//-----------------------------------------------------------------------------
				// for each potential_decendent, see if it traces back to the part in question 
				//-----------------------------------------------------------------------------
				while ( testing )
				{
					root = _phenotype.parts[ root ].parent; //trickle the root down the ancestral tree...

					//------------------------------------------
					// we have traced a decendent 
					//------------------------------------------
					if ( root == p )
					{
						_phenotype.parts[p].numDecendents ++;
						_phenotype.parts[p].decendent[ _phenotype.parts[p].numDecendents ] = potentialDecendent;
						testing = false;
					}

					//--------------------------------------------------------------
					// quit if you have if traced all the way back to ROOT_PART 
					//--------------------------------------------------------------
					if ( root == ROOT_PART )
					{
						testing = false;
					}
				} 
			}   
		} 
	}




	//-----------------------------------------------------------------------------------
	// create
	//-----------------------------------------------------------------------------------
	this.create = function( index, age, position, angle, energy, genotype, embryology )
	{
	    //---------------------------------------
	    // clear out everything for starters...
	    //---------------------------------------
	    this.clear();
	    
	    
        ///contents of clear...
	    
	    /*
        _genotype.clear(); 

        _lastPositionForEfficiencyMeasurement.clear();
        _position.clear();
        _velocity.clear();
        _acceleration.clear();
        _heading.clear();
        _directionToGoal.clear();
        _focusDirection.clear();
        _centerOfMass.clear();
        _vectorUtility.clear();

        _chosenFoodBit      = null; 
        _chosenMate         = null; 
        _age 	  		    = 0;
        _numOffspring       = 0;
        _numFoodBitsEaten   = 0;
        _index              = NULL_INDEX;
        _chosenMateIndex    = NULL_INDEX;
        _chosenFoodBitIndex = NULL_INDEX;
        _alive 	  		    = false;
        _tryingToMate       = false;
        _tryingToEat        = false;
        _growthScale        = ZERO;
        _torque             = ZERO;
        _angle			    = ZERO;
        _spin			    = ZERO;
        _energy			    = ZERO;
        _timer              = ZERO;
        _timerDelta         = ZERO;
        _energyEfficiency   = ZERO;
        _selectRadius       = ZERO;	
        _lastEnergyForEfficiencyMeasurement = ZERO;
        _readyforSensoryInputToBrain = false;
        */
	
/// if the clear routine above takes care of it, I can delete the assignments below...	
	
		//----------------------------
		// set some basic properties
		//----------------------------
//_position.set( position );
_position.copyFrom( position );

		//_velocity.clear();
		_index              = index;
		_angle 		        = angle;
		_age		        = age;
		_energy             = energy;
		_alive		        = true;
		_growthScale        = ONE;
		//_maximumLifeSpan    = DEFAULT_MAXIMUM_LIFESPAN;
		
		//_spin		        = ZERO;
        //_numOffspring       = 0;
		//_numFoodBitsEaten   = 0;
		//_torque             = ZERO;
        //_selectRadius       = ZERO;
		//_acceleration.clear();
		
		
		
//make sure all variables are initialized!!! (to be safe and stuff)
		
	/*
	let _heading		    = new Vector2D();
	let _directionToGoal    = new Vector2D();
	let _focusDirection	    = new Vector2D();
	let _centerOfMass	    = new Vector2D();
	let _vectorUtility      = new Vector2D();
	let _chosenFoodBit      = new FoodBit();
	let _chosenMate         = null; // must start as null!
	let _chosenMateIndex    = NULL_INDEX;
	let _chosenFoodBitIndex = NULL_INDEX;
	let _tryingToMate       = false;
	let _tryingToEat        = false;
	let _growthScale        = ZERO;
	let _timer              = ZERO;
	let _timerDelta         = ZERO;
	let _readyforSensoryInputToBrain = false;
	*/		
		
		
		
		
		
		
        //-----------------------------------------
		// copy genotype values to this swimbot...
		//-----------------------------------------
        _genotype.copyFromGenotype( genotype );        
		assert( _genotype != null, "_genotype != null" );

 		//--------------------------------
		// generate phenotype
		//--------------------------------
		_phenotype = embryology.generatePhenotypeFromGenotype( _genotype );
		
 		//--------------------------------
		// important
		//--------------------------------
		this.processPhenotype();
		
		//------------------------------------------------
		// initialize energy efficiency-related stuff 
		//------------------------------------------------
	    _lastPositionForEfficiencyMeasurement.set( _position );
	    _lastEnergyForEfficiencyMeasurement = _energy;

	    //console.log( "_lastPositionForEfficiencyMeasurement = " + _lastPositionForEfficiencyMeasurement );
	    //console.log( "_lastEnergyForEfficiencyMeasurement = " + _lastEnergyForEfficiencyMeasurement );
	    //console.log( "_energyEfficiency = " + _energyEfficiency );
        
    	//--------------------------------
	    // initialize brain
	    //--------------------------------
        _brain.initialize();
        _brain.setHungerThreshold( DEFAULT_SWIMBOT_HUNGER_THRESHOLD );
        _brain.setEnergyLevel( _energy );
        _brain.update();
	}


	//-----------------------------------
    this.setHungerThreshold = function(t)
    {
        _brain.setHungerThreshold(t);
    }


	//---------------------------------------------------------------
	// should be called after "generatePhenotypeFromGenotype"
	//---------------------------------------------------------------
    this.processPhenotype = function()
    {
		//-----------------------------------------------------
		// calculate masses and total part length
		//-----------------------------------------------------
        _phenotype.mass = ZERO;
		assert( _phenotype.numParts > 0, "_phenotype.numParts > 0" );
		
		_phenotype.sumPartLengths = ZERO;

		for (let p=1; p<_phenotype.numParts; p++)
		{
			_phenotype.sumPartLengths += _phenotype.parts[p].length;

			assert( _phenotype.parts[p].length > ZERO, "_phenotype.parts[p].length > ZERO" );
			assert( _phenotype.parts[p].width  > ZERO, "_phenotype.parts[p].width  > ZERO" );

			_phenotype.parts[p].mass = _phenotype.parts[p].length * _phenotype.parts[p].width;

			assert( _phenotype.parts[p].mass > ZERO, "_phenotype.parts[p].mass > ZERO" );

			_phenotype.mass += _phenotype.parts[p].mass;
		}	

        assert( _phenotype.mass > ZERO, "_phenotype.mass > ZERO" );
		
		//--------------------------------
		// compute moment factors 
		//--------------------------------
		this.computeMomentFactors();
	    
    	//--------------------------------
	    // create that body...now
	    //--------------------------------
        this.updateBodyParts();
        
/*
		//----------------------------
		// calculate select radius
		//----------------------------
		
//fix!  doesn't work on infants!		
		
		_selectRadius = ZERO;
		
		for (let p=1; p<_phenotype.numParts; p++)
		{
		    for (let o=1; o<_phenotype.numParts; o++)
	    	{
	    	    if ( o != p )
	    	    {	    	    
	    	        let distance = _phenotype.parts[p].position.getDistanceTo( _phenotype.parts[o].position );
	    	        if ( distance > _selectRadius )
	    	        {
	    	            _selectRadius = distance;
	    	        }
	    	    }
    		}	
		}	
		
		//-------------------------------------------------------------------------
		// HACK...
		// I don't know why - but this makes is come out basically okay...
		//-------------------------------------------------------------------------
		//_selectRadius = SWIMBOT_SELECT_RADIUS_SCALAR * Math.sqrt( _selectRadius );
		
		if ( _selectRadius < MIN_SELECT_RADIUS )
		{
		    _selectRadius = MIN_SELECT_RADIUS;
		}
*/				
		//--------------------------------
		// do this 
		//--------------------------------
        _timerDelta = ZERO;
    }


	//-----------------------------------------
	this.zap = function( embryology, amount )
	{
	    _genotype.zap( amount );
		assert( _genotype != null, "_genotype != null" );
		
 		//--------------------------------
		// generate phenotype
		//--------------------------------
		_phenotype = embryology.generatePhenotypeFromGenotype( _genotype );

 		//--------------------------------
		// important
		//--------------------------------
        this.processPhenotype();
     }

	
	//---------------------------------------------------------------
	this.setGeneValue = function( geneIndex, geneValue, embryology )
		{

	 		//--------------------------------
		// set gene value
		//--------------------------------
    	_genotype.setGeneValue( geneIndex, geneValue );

 		//--------------------------------
		// generate phenotype
		//--------------------------------
		_phenotype = embryology.generatePhenotypeFromGenotype( _genotype );
		
 		//--------------------------------
		// important
		//--------------------------------
		this.processPhenotype();
	}


	//--------------------------------
	// update
	//--------------------------------
	this.update = function()
	{
		//---------------------------
		// update age
		//---------------------------
		_age ++;
		
        if ( _age % BRAIN_SENSORY_UPDATE_PERIOD == 0 ) 
        {
            _readyforSensoryInputToBrain = true;
        }
		
        //-----------------------------
        // update brain
        //-----------------------------
        _brain.setEnergyLevel( _energy );
        _brain.update();
        
        //-------------------------------------
        // I wanna eat my chosen food bit...
        //-------------------------------------
        if ( _brain.getState() === BRAIN_STATE_PURSUING_FOOD )
        {
            if (( _chosenFoodBit != null )
            &&  ( _chosenFoodBit.getAlive()))
            {
                //let distanceSquared = _chosenFoodBit.getPosition().getDistanceSquaredTo( _phenotype.parts[ MOUTH_INDEX ].position );
                //if ( distanceSquared < SWIMBOT_MOUTH_LENGTH * SWIMBOT_MOUTH_LENGTH )

                let xx = _chosenFoodBit.getPosition().x - this.getMouthPosition().x;
                let yy = _chosenFoodBit.getPosition().y - this.getMouthPosition().y;
                let distance = Math.sqrt( xx*xx + yy*yy );

                if ( distance < SWIMBOT_MOUTH_LENGTH )                
                {
                    _tryingToEat = true;                    
                    //console.log( "I'm trying to eat!" );
                }
            }
        }

        //------------------------------------------
        // I wanna have sex with my chosen swimbot
        //------------------------------------------
        else if ( _brain.getState() === BRAIN_STATE_PURSUING_MATE )
        {
            if (( _chosenMate != null )
            &&  ( _chosenMate.getAlive() ))
            {
                let xx = _chosenMate.getGenitalPosition().x - this.getGenitalPosition().x;
                let yy = _chosenMate.getGenitalPosition().y - this.getGenitalPosition().y;
                let distance = Math.sqrt( xx*xx + yy*yy );

                if ( distance < SWIMBOT_GENITAL_LENGTH )

                /*
                //fix!!!!!
                let distanceSquared = _chosenMate.getGenitalPosition().getDistanceSquaredTo( this.getGenitalPosition() );
                console.log( distanceSquared + ", " + SWIMBOT_GENITAL_LENGTH * SWIMBOT_GENITAL_LENGTH );
                if ( distanceSquared < SWIMBOT_GENITAL_LENGTH * SWIMBOT_GENITAL_LENGTH )
                */
                {
                    _tryingToMate = true;
                }
            }
        }
    
        //----------------------------------------------------------------------
        // determine the direction to the goal...
        //----------------------------------------------------------------------
        if (( _brain.getState() === BRAIN_STATE_LOOKING_FOR_FOOD )
        ||  ( _brain.getState() === BRAIN_STATE_LOOKING_FOR_MATE ))
        {
            this.wanderFocus();
        }
        else if ( _brain.getState() == BRAIN_STATE_PURSUING_MATE )
        {
            //console.log( "BRAIN_STATE_PURSUING_MATE");
            if ( _chosenMate != null )
            {
                _directionToGoal.set( _chosenMate.getGenitalPosition() );	
                _directionToGoal.subtract( _phenotype.parts[ GENITAL_INDEX ].position );
                _directionToGoal.normalize();
            }
        }
        else if ( _brain.getState() === BRAIN_STATE_PURSUING_FOOD )
        {
            //console.log( "BRAIN_STATE_PURSUING_FOOD");
            if ( _chosenFoodBit != null )
            {
                _directionToGoal.set( _chosenFoodBit.getPosition() );	
                _directionToGoal.subtract( _phenotype.parts[ MOUTH_INDEX ].position );
                _directionToGoal.normalize();
            }
        }
        

        //----------------------------------------------------------------------
        // continually push the focus direction towards the goal
        //----------------------------------------------------------------------
        let previousFocusDirection = new Vector2D();
        previousFocusDirection.set( _focusDirection );

        _focusDirection.addScaled( _directionToGoal, BRAIN_FOCUS_TARGET_SHIFT_STRENGTH );

        _vectorUtility.setToDifference( _focusDirection, previousFocusDirection );

        if ( _vectorUtility.getMagnitudeSquared() > BRAIN_FOCUS_TARGET_SHIFT_THRESHOLD * BRAIN_FOCUS_TARGET_SHIFT_THRESHOLD )
        { 
            _focusDirection.set( previousFocusDirection );
            _focusDirection.addScaled( _directionToGoal, BRAIN_FOCUS_TARGET_SHIFT_THRESHOLD );
        }
        
        _focusDirection.normalize();

        //old version
        //_focusDirection.addScaled( _directionToGoal, BRAIN_FOCUS_TARGET_SHIFT_STRENGTH );
        //_focusDirection.normalize();
        
		//---------------------------
		// update body parts
		//---------------------------
		this.updateBodyParts();

		//---------------------------
		// update physics
		//---------------------------
        this.updatePhysics();
	}



	//----------------------------------------
	// wander focus
	//----------------------------------------
	this.wanderFocus = function()
	{
	    let length = _directionToGoal.getMagnitude();
	    
	    if ( length === ZERO )
	    {
	        //console.log( "ZERO!!!" );
	        _directionToGoal.x = -ONE_HALF + Math.random();
	        _directionToGoal.y = -ONE_HALF + Math.random();
	        length = _directionToGoal.getMagnitude();
	    }
	
        _directionToGoal.x += ( -BRAIN_WANDER_AMOUNT * ONE_HALF + Math.random() * BRAIN_WANDER_AMOUNT );
        _directionToGoal.y += ( -BRAIN_WANDER_AMOUNT * ONE_HALF + Math.random() * BRAIN_WANDER_AMOUNT );
        
        _directionToGoal.x /= length;
        _directionToGoal.y /= length;

        //console.log( _directionToGoal.x + ", " + _directionToGoal.y );
    }
    



	//----------------------------------------
	// update physics
	//----------------------------------------
	this.updatePhysics = function()
	{
        //---------------------------------------------------------------------------
        // a swimbot creates its own linear and angular forces via moving parts
        //---------------------------------------------------------------------------
        this.calculateFluidForces();
 	    
        if ( _age % ENERGY_EFFICIENCY_MEASUREMENT_PERIOD === 0 )
        {
            this.calculateEnergyEfficiency();		
        }
    
        //---------------------------------------------
        // energy is always slowly draining 
        //---------------------------------------------
        _energy -= CONTINUAL_ENERGY_DRAIN;
        
        //---------------------------------------------
        // when energy hits zero, that means death 
        //---------------------------------------------
        if ( _energy <= ZERO )
        {
            _energy = ZERO;
            this.die();
        }		

		//---------------------------
		// wall collisions
		//---------------------------
		this.updateWallCollisions();        	
	}

    
    //---------------------------------------------------------------------------
    // swimbot creates its own linear and angular forces via moving parts
    //---------------------------------------------------------------------------
	this.calculateFluidForces = function()
	{
        //-----------------------------------------------------
        // clear these out - they will be filled-in below...
        //-----------------------------------------------------
	    _acceleration.clear();
	    _torque = ZERO;
	    
        //----------------------------------------
        // loop through parts...
        //----------------------------------------
        assert( _phenotype.numParts > 0, "_phenotype.numParts > 0" );  
        
		for (let p=1; p<_phenotype.numParts; p++)
		{
		    //---------------------------------------------------------
		    // calculate this part's fraction of the total length
		    //---------------------------------------------------------
            let fractionOfWhole = _phenotype.parts[p].length / _phenotype.sumPartLengths;
		
		    //---------------------------------------------------------
		    // calculate velocity
		    //---------------------------------------------------------
            _phenotype.parts[p].velocity.setToDifference( _phenotype.parts[p].midPosition, _phenotype.parts[p].previousMid );
            
            /*
		    //---------------------------------------------------------
		    // get part axis
		    //---------------------------------------------------------
            _phenotype.parts[p].axis.x = _phenotype.parts[p].position.x - _phenotype.parts[ _phenotype.parts[p].parent ].position.x;
            _phenotype.parts[p].axis.y = _phenotype.parts[p].position.y - _phenotype.parts[ _phenotype.parts[p].parent ].position.y;
            
		    //---------------------------------------------------------
		    // get perpendicular of part axis
		    //---------------------------------------------------------
            _phenotype.parts[p].perpendicular.setXY( _phenotype.parts[p].axis.y / _phenotype.parts[p].length, -_phenotype.parts[p].axis.x / _phenotype.parts[p].length );
            */
            
		    //---------------------------------------------------------
		    // get stroke amplitude 
		    //---------------------------------------------------------
            let strokeAmplitude = _phenotype.parts[p].velocity.dotWith( _phenotype.parts[p].perpendicular ) * fractionOfWhole;
            
            let strokeForceX = _phenotype.parts[p].perpendicular.x * strokeAmplitude;
            let strokeForceY = _phenotype.parts[p].perpendicular.y * strokeAmplitude;

            //-------------------------------------------------
            // calcualte energy lost from stroke
		    //
		    // hey: this might be more accurate to nature if 
		    // it were something like angle bend times mass.
            //--------------------------------------------------
            _energy -= Math.abs( strokeAmplitude ) * ENERGY_USED_UP_SWIMMING;
            
            if ( _energy < ZERO )
            {
                _energy = ZERO;
            }

            //-------------------------------------------------
            // calculate part vector from center
            //-------------------------------------------------
            let partVectorFromCenterX = _phenotype.parts[p].midPosition.x - _position.x;
            let partVectorFromCenterY = _phenotype.parts[p].midPosition.y - _position.y;

            //-------------------------------------------------
            // calculate part distance from center
            //-------------------------------------------------
            let xx = partVectorFromCenterX * partVectorFromCenterX;
            let yy = partVectorFromCenterY * partVectorFromCenterY;            
            let distance = Math.sqrt( xx*xx + yy*yy );
            
            if ( distance > ZERO )
            {
                //-------------------------------------------------
                // calculate part direction from center
                //-------------------------------------------------
                let partDirectionFromCenterX = partVectorFromCenterX / distance;
                let partDirectionFromCenterY = partVectorFromCenterY / distance;

/*
//---------------------------------------------------------------
// get dot of strokeForce with partDirectionFromCenter
//---------------------------------------------------------------
let dot = strokeForceX * partDirectionFromCenterX + strokeForceY * partDirectionFromCenterY;
//let dot = ONE - ( strokeForceX * partDirectionFromCenterX + strokeForceY * partDirectionFromCenterY );
//let dot = -ONE + ( strokeForceX * partDirectionFromCenterX + strokeForceY * partDirectionFromCenterY );
//let dot = 1.0; //strokeForceX * partDirectionFromCenterX + strokeForceY * partDirectionFromCenterY;
//let dot = -ONE;

//--------------------------------------------------------
// set part acceleration 
//--------------------------------------------------------
let partAccelerationX = partDirectionFromCenterX * dot;
let partAccelerationY = partDirectionFromCenterY * dot;
*/

let partAccelerationX = -strokeForceX;
let partAccelerationY = -strokeForceY;
                
                //-------------------------------
                // accumulate acceleration 
                //-------------------------------
                _acceleration.x += partAccelerationX;
                _acceleration.y += partAccelerationY;
            
                //------------------------------------------------
                // calculate perpendicular 
                //------------------------------------------------
                let partPerpendicularX =  partVectorFromCenterY;
                let partPerpendicularY = -partVectorFromCenterX;   
            
                //let partPerpendicularX =  partDirectionFromCenterY;
                //let partPerpendicularY = -partDirectionFromCenterX;
                
                //---------------------------------------------------------------
                // get dot of strokeForce with partPerpendicular
                //---------------------------------------------------------------
                let perpDot = ( strokeForceX * partPerpendicularX + strokeForceY * partPerpendicularY ) / _phenotype.sumPartLengths;

                //-------------------------------
                // accumulate torque 
                //-------------------------------
                let previousTorque = _torque;
                _torque -= perpDot;                
                
                /*
                //------------------------------------------------------------------
                // contradictory torque (cancelling-out) goes into acceleration...
                //------------------------------------------------------------------
                let torqueBecameSmaller = false;
                
                if ( Math.abs( _torque ) < Math.abs( previousTorque ) )
                {
                    partAccelerationX += 0.0;
                    partAccelerationY += 0.0;
                }
                */
            }
        }	    
        
        //-----------------------------------------------------------------
        // apply linear and angular forces to velocity and spin
        //-----------------------------------------------------------------
        _velocity.add( _acceleration );
        _spin += _torque;// * SPIN_SCALAR;
//_spin *= SPIN_DECAY;

		//--------------------------------------------------
		// update position by velocity, and angle by spin
		//--------------------------------------------------
        _position.add( _velocity );
        _angle += _spin;  
    }
    




	//----------------------------------------
	// calculate energy efficiency
	//----------------------------------------
	this.calculateEnergyEfficiency = function()
	{
	    //-----------------------------------------------
        // measure distance traveled and energy lost
	    //-----------------------------------------------        
        let distanceTraveled = _position.getDistanceTo( _lastPositionForEfficiencyMeasurement );
        //console.log( distanceTraveled );
        
        let averageSpeed = distanceTraveled / ENERGY_EFFICIENCY_MEASUREMENT_PERIOD;		
        let energyLost   = _lastEnergyForEfficiencyMeasurement - _energy;
        
        //----------------------------------------------------------
        //if swimbot ate food, energy went up, so cancel that....
        //----------------------------------------------------------
        if ( energyLost < ZERO ) 
        {
            energyLost = ZERO;
        }
        
        //------------------------------
        // calculate efficiency
        //------------------------------
        _energyEfficiency = averageSpeed / ( ONE + energyLost );
        
        // reset these values for the next go-round...
        _lastPositionForEfficiencyMeasurement.set( _position );
        _lastEnergyForEfficiencyMeasurement = _energy;
    }
    

	//----------------------------------------
	// update wall collisions
	//----------------------------------------
	this.updateWallCollisions = function()
	{	
        //--------------------------------------------------------------------
        // left wall
        //--------------------------------------------------------------------
        if ( _position.x < POOL_LEFT + _phenotype.sumPartLengths * ONE_HALF ) 
        {
            //console.log( "left " );            
            for (let p=1; p<_phenotype.numParts; p++)
            {
                let radius = _phenotype.parts[p].length + _phenotype.parts[p].width;
                let limit = POOL_LEFT + radius;

                if ( _phenotype.parts[p].position.x < limit )
                {
                    let penetration = limit - _phenotype.parts[p].position.x;
                    
                    _position.x         += penetration * WALL_BOUNCE;
                    _velocity.x         += penetration * WALL_BOUNCE; 
                    _directionToGoal.x  += penetration * WALL_BOUNCE;                    
                    _directionToGoal.normalize();
                }
            } 
        }  
        //-------------------------------------------------------------------------
        // right wall
        //-------------------------------------------------------------------------
        else if ( _position.x > POOL_RIGHT - _phenotype.sumPartLengths * ONE_HALF ) 
        {
            //console.log( "right " );
            for (let p=1; p<_phenotype.numParts; p++)
            {
                let radius = _phenotype.parts[p].length + _phenotype.parts[p].width;
                let limit = POOL_RIGHT - radius;

                if ( _phenotype.parts[p].position.x > limit )
                {
                    let penetration = limit - _phenotype.parts[p].position.x;

                    _position.x         += penetration * WALL_BOUNCE;
                    _velocity.x         += penetration * WALL_BOUNCE; 
                    _directionToGoal.x  += penetration * WALL_BOUNCE;                    
                    _directionToGoal.normalize();
                }
            }   
        }
        
        //------------------------------------------------------------------------------
        // top wall
        //------------------------------------------------------------------------------
        if ( _position.y < POOL_TOP + _phenotype.sumPartLengths * ONE_HALF ) 
        {
            //console.log( "top" );
            
            for (let p=1; p<_phenotype.numParts; p++)
            {
                let radius = _phenotype.parts[p].length + _phenotype.parts[p].width;
                let limit = POOL_TOP + radius;

                if ( _phenotype.parts[p].position.y < limit )
                {
                    let penetration = limit - _phenotype.parts[p].position.y;

                    _position.y         += penetration * WALL_BOUNCE;
                    _velocity.y         += penetration * WALL_BOUNCE; 
                    _directionToGoal.y  += penetration * WALL_BOUNCE;                    
                    _directionToGoal.normalize();
                }
            }   
        }
        //------------------------------------------------------------------------------
        // bottom wall
        //------------------------------------------------------------------------------
        else if ( _position.y > POOL_BOTTOM - _phenotype.sumPartLengths * ONE_HALF ) 
        {
            for (let p=1; p<_phenotype.numParts; p++)
            {
                let radius = _phenotype.parts[p].length + _phenotype.parts[p].width;
                let limit = POOL_BOTTOM - radius;

                if ( _phenotype.parts[p].position.y > limit )
                {
                    let penetration = limit - _phenotype.parts[p].position.y;

                    _position.y         += penetration * WALL_BOUNCE;
                    _velocity.y         += penetration * WALL_BOUNCE; 
                    _directionToGoal.y  += penetration * WALL_BOUNCE;                    
                    _directionToGoal.normalize();
                }
            }   
        }
    }
    
	//---------------------------
	// set position
	//---------------------------
	this.setPosition = function(p)
	{
        _position.set(p);
        
		//-----------------------------------------
		// here is where I shift all my body nodes
		// to keep my center of mass in place...
		//-----------------------------------------
        this.adjustToCenterOfMass();

		//------------------------------------
		// I need to do this again because I 
		// just did an adjustToCenterOfMass
		//------------------------------------
		this.calculateCenterOfMass();        
    }


	//---------------------------
	// set velocity
	//---------------------------
	this.setVelocity = function(v)
	{
        _velocity.set(v);
    }

	//---------------------------------
	// add to velocity 
	//---------------------------------
	this.addForce = function( force )
	{
	    _velocity.add( force );
    }


	//---------------------------
	// set energy
	//---------------------------
	this.setEnergy = function(e)
	{
        _energy = e;
    }

	//---------------------------
	// set angle
	//---------------------------
	this.setAngle = function(a)
	{
        _angle = a;
    }


	//--------------------------------------------------------------------------------------------------------
	// get functions
	//--------------------------------------------------------------------------------------------------------
	this.getIsTryingToEat               = function() { return _tryingToEat;                                 }
	this.getIsTryingToMate              = function() { return _tryingToMate;                                }
	this.getIndex                       = function() { return _index;                                       }
	this.getAge                         = function() { return _age;                                         }
	this.getAlive                       = function() { return _alive;                                       }
	this.getEnergy                      = function() { return _energy;                                      }
	this.getAngle                       = function() { return _angle;                                       }
	this.getEnergyEfficiency            = function() { return _energyEfficiency;                            }
	this.getPosition                    = function() { return _position;                                    }
	this.getBoundingRadius              = function() { return _phenotype.sumPartLengths;                    }
	this.getNumParts                    = function() { return _phenotype.numParts;                          }
	this.getIsLookingForSensoryInput    = function() { return _readyforSensoryInputToBrain;                 }
	this.getGenitalPosition             = function() { return _phenotype.parts[ GENITAL_INDEX ].position;   }
	this.getMouthPosition               = function() { return _phenotype.parts[ MOUTH_INDEX   ].position;   }
	this.getChosenMateIndex             = function() { return _chosenMateIndex;                             }
	this.getChosenFoodBitIndex          = function() { return _chosenFoodBitIndex;                          }
	this.getNumOffspring                = function() { return _numOffspring;                                }
	this.getNumFoodBitsEaten            = function() { return _numFoodBitsEaten;                            }
    this.getBrainState                  = function() { return _brain.getState();                            }
    this.getGenotype                    = function() { return _genotype;                                    }
	this.getSelectRadius                = function() { return _selectRadius;                                }
	this.getPreferredFoodType           = function() { return _phenotype.preferredFoodType;                 }
	this.getDigestibleFoodType          = function() { return _phenotype.digestibleFoodType;                }
	

	//---------------------------------------
    this.getGoalDescription = function() 
    { 
        let brainState = _brain.getState();
        
             if ( brainState ===  BRAIN_STATE_RESTING            ) { return "resting";              }
        else if ( brainState ===  BRAIN_STATE_LOOKING_FOR_MATE   ) { return "looking for mate";     }
        else if ( brainState ===  BRAIN_STATE_PURSUING_MATE      ) { return "pursuing mate";        }
        else if ( brainState ===  BRAIN_STATE_LOOKING_FOR_FOOD   ) { return "looking for food bit"; }
        else if ( brainState ===  BRAIN_STATE_PURSUING_FOOD      ) { return "pursuing food bit";    }
                
        return "(no goal identified)";
    }
    

	//---------------------------------------
    this.getAttractionDescription = function() 
    { 
        let a = _brain.getAttractionCriterion();
        
             if ( a === ATTRACTION_COLORFUL         ) { return "colorful";          }
        else if ( a === ATTRACTION_BIG              ) { return "big";               }
        else if ( a === ATTRACTION_HYPER            ) { return "hyper";             }
        else if ( a === ATTRACTION_LONG             ) { return "long";              }
        else if ( a === ATTRACTION_STRAIGHT         ) { return "straight";          }
        else if ( a === ATTRACTION_NO_COLOR         ) { return "no color";          }
        else if ( a === ATTRACTION_SMALL            ) { return "small";             }
        else if ( a === ATTRACTION_STILL            ) { return "still";             }
        else if ( a === ATTRACTION_SHORT            ) { return "short";             }
        else if ( a === ATTRACTION_CROOKED          ) { return "crooked";           }
        else if ( a === ATTRACTION_SIMILAR_COLOR    ) { return "similar color";     }
        else if ( a === ATTRACTION_SIMILAR_SIZE     ) { return "similar size";      }
        else if ( a === ATTRACTION_SIMILAR_HYPER    ) { return "similar hyper";     }
        else if ( a === ATTRACTION_SIMILAR_LENGTH   ) { return "similar length";    }
        else if ( a === ATTRACTION_SIMILAR_STRAIGHT ) { return "similar straight";  }
        else if ( a === ATTRACTION_RANDOM           ) { return "random";            }
        else if ( a === ATTRACTION_CLOSEST          ) { return "closest";           }
        
        return "(no attraction identified)";
    }
    
 
	//---------------------------
	// get part parent position
	//---------------------------
	this.getPartParentPosition = function(p)
	{
		if ( _phenotype.parts[p].parent == NULL_PART )
		{
			return _position;
		}

		return _phenotype.parts[ _phenotype.parts[p].parent ].position;
	}



	//---------------------------
	// eatChosenFoodBit
	//---------------------------
	this.eatChosenFoodBit = function()
	{
    	//let foodBitIndex = NULL_INDEX;
    	
    	//console.log( "let's eat this" );
    
        assert( _chosenFoodBit != null, "Swimbot:eatChosenFoodBit: _chosenFoodBit != null" );
        assert( _chosenFoodBit.getAlive(), "Swimbot:eatChosenFoodBit: _chosenFoodBit.getAlive()" );
        
        if (( _chosenFoodBit != null )
        &&  ( _chosenFoodBit.getAlive() ))
        {	
            let energyFromFoodBit = _chosenFoodBit.getEnergy();

            if ( globalTweakers.numFoodTypes > 1 )
            {
                /*
                console.log( "-------------------------------" );
                console.log( " eating....." );
                console.log( "_chosenFoodBit.getType() = " + _chosenFoodBit.getType() );
                console.log( "_phenotype.digestibleFoodType  = " + _phenotype.digestibleFoodType  );
                console.log( " " );
                console.log( "-------------------------------" );
                */
                
                //----------------------------------------------------------------------
                // If the type of the chosen food bit is not compatible with the 
                // digestible type of the swimbot, then it gets less energy...
                //----------------------------------------------------------------------
                if ( _chosenFoodBit.getType() != _phenotype.digestibleFoodType )
                {
                    //console.log( "decrease energy from food bit..." );
                    energyFromFoodBit *= FOOD_TYPE_OFFSET;
                }
            }

            _energy += energyFromFoodBit;
            
            _numFoodBitsEaten ++;
            
            assert( _chosenFoodBit.getEnergy() >= ZERO, "Swimbot:eatChosenFoodBit: _chosenFoodBit.getEnergy() >= ZERO" );	
            	
            _tryingToEat = false;
             
            _timerDelta = ZERO;

            //foodBitIndex = _chosenFoodBit.getIndex();
            
            assert( _chosenFoodBitIndex != NULL_INDEX, "Swimbot:eatChosenFoodBit: _chosenFoodBitIndex != NULL_INDEX" );

            _chosenFoodBit.kill();

// somehow, the swimbot is still looking for food even when it is too far away
// not sure if this is the right place to fix, but it needs fixing
            //_brain.setFoundFoodBit( false );
        }
    
        return _chosenFoodBitIndex;
    }
    
    

	//--------------------------------------------
	// setEnvironmentalStimuli
	//--------------------------------------------
	this.setEnvironmentalStimuli = function( numNearbySwimbots, nearbySwimbotArray, foodBitWasFound, theFoodBit )
    {
        //------------------------------------------------------------
        // if looking for a food bit, choose the one that was found
        //------------------------------------------------------------
        _chosenFoodBit = null;
        _chosenFoodBitIndex = NULL_INDEX;
        
        if (( _brain.getState() == BRAIN_STATE_LOOKING_FOR_FOOD )
        ||  ( _brain.getState() == BRAIN_STATE_PURSUING_FOOD ))
        {
            _brain.setFoundFoodBit( foodBitWasFound );
    
            if ( foodBitWasFound )
            {
                //console.log( "foodBitWasFound" );            
                assert( theFoodBit != null, "swimbot.js: setEnvironmentalStimuli: theFoodBit != null" );
                _chosenFoodBit = theFoodBit;	
                _chosenFoodBitIndex = _chosenFoodBit.getIndex();
            }
        }

        //------------------------------------------------------------------------------------------------
        // if looking for mate, scan the nearby swimbots and choose the most attractive...
        //------------------------------------------------------------------------------------------------	
        if ( _brain.getState() === BRAIN_STATE_LOOKING_FOR_MATE )
        {			
            //console.log( "horny" );
            
            let mostAttractiveFound = new Swimbot;
            let atLeastOneBabeIsVisible = false;
            let highestBabeFactor = -100.0;

            for (let o=0; o<numNearbySwimbots; o++)
            {	                
                let babeFactor = nearbySwimbotArray[o].getAttractiveness( this );

                if (( babeFactor > highestBabeFactor )
                &&  ( babeFactor > TOO_UGLY_TO_CHOOSE )
                &&  ( nearbySwimbotArray[o].getAge() > YOUNG_AGE_DURATION )
                &&  ( nearbySwimbotArray[o].getEnergy() > STARVING ))
                {
                    //console.log( "ok" );
                    highestBabeFactor = babeFactor;
                    mostAttractiveFound = nearbySwimbotArray[o];
                    assert( mostAttractiveFound != null, "mostAttractiveFound != null" );
                    atLeastOneBabeIsVisible = true;
                }
            }
            
            if ( atLeastOneBabeIsVisible )
            {
                _chosenMate = mostAttractiveFound;
                assert( _chosenMate != null, "_chosenMate != null" );

                _chosenMateIndex = mostAttractiveFound.getIndex();
                assert( _chosenMateIndex != NULL_INDEX, "_chosenMateIndex != NULL_INDEX" );
                
                _brain.setFoundSwimbot( true );
            }
            else
            {
                _brain.setFoundSwimbot( false );
            }
        }
        else if ( _brain.getState() == BRAIN_STATE_PURSUING_MATE )
        {
            //console.log( "pursuing mate" );
            
            let ICanStillSeeYou = false;

            for (let o=0; o<numNearbySwimbots; o++)
            {	
                let index = nearbySwimbotArray[o].getIndex();
                if ( index === _chosenMateIndex )
                {
                    ICanStillSeeYou = true;
                    _chosenMate = nearbySwimbotArray[o];
                }
            }

            if ( ICanStillSeeYou )
            {
                /*
                assert( chosenMate != NULL );
                if ( chosenMate->getEnergy() < STARVING )
                {
                    state.brain.setFoundSwimbot( false );
                    chosenMate = NULL;
                    state.chosenMateIndex = -1;
                }
                */
            }
            else
            {
                //console.log( "can't see you anymore" );
                _brain.setFoundSwimbot( false );
                _chosenMate = null;
                _chosenMateIndex = NULL_INDEX;
            }
        }

    	//--------------------------------------------
    	// reset this to false for next time around
    	//--------------------------------------------
    	_readyforSensoryInputToBrain = false;
    	
    } //setEnvironmentalStimuli

    
    
	//-----------------------------------------
	// set attraction
	//-----------------------------------------
	this.setAttraction = function( attraction )
	{
	    _brain.setAttraction( attraction );
	    
//here I need to tell the brain to stop pursuing its current chosen mate (if it is)...	    
	    
	}

    
    
	//-----------------------------------------
	// get attractiveness
	//-----------------------------------------
	this.getAttractiveness = function( judge )
	{
        let attractiveness = Math.random();
        
        let attractionCriterion = _brain.getAttractionCriterion();
        
        //console.log( "attractionCriterion = " + attractionCriterion );
        
        if ( attractionCriterion === ATTRACTION_COLORFUL        ) { attractiveness =        this.getColorSaturation         (); }
        if ( attractionCriterion === ATTRACTION_BIG             ) { attractiveness =        this.getCurrentBodyBigness      (); }
        if ( attractionCriterion === ATTRACTION_HYPER           ) { attractiveness =        this.getCurrentBodyHyperness    (); }
        if ( attractionCriterion === ATTRACTION_LONG            ) { attractiveness =        this.getCurrentBodyLongness     (); }
        if ( attractionCriterion === ATTRACTION_STRAIGHT        ) { attractiveness =        this.getCurrentBodyStraightness (); }
        
        if ( attractionCriterion === ATTRACTION_NO_COLOR        ) { attractiveness = ONE -  this.getColorSaturation         (); }
        if ( attractionCriterion === ATTRACTION_SMALL           ) { attractiveness = ONE -  this.getCurrentBodyBigness      (); }
        if ( attractionCriterion === ATTRACTION_STILL           ) { attractiveness = ONE -  this.getCurrentBodyHyperness    (); }
        if ( attractionCriterion === ATTRACTION_SHORT           ) { attractiveness = ONE -  this.getCurrentBodyLongness     (); }
        if ( attractionCriterion === ATTRACTION_CROOKED         ) { attractiveness = ONE -  this.getCurrentBodyStraightness (); }
        
        if ( attractionCriterion === ATTRACTION_SIMILAR_COLOR   ) { attractiveness =        this.getColorSimilarity         ( judge ); }
        if ( attractionCriterion === ATTRACTION_SIMILAR_SIZE    ) { attractiveness =        this.getBignessSimilarity       ( judge ); }
        if ( attractionCriterion === ATTRACTION_SIMILAR_HYPER   ) { attractiveness =        this.getHypernessSimilarity     ( judge ); }
        if ( attractionCriterion === ATTRACTION_SIMILAR_LENGTH  ) { attractiveness =        this.getLengthSimilarity        ( judge ); }
        if ( attractionCriterion === ATTRACTION_SIMILAR_STRAIGHT) { attractiveness =        this.getStraightessSimilarity   ( judge ); }
        
        if ( attractionCriterion === ATTRACTION_CLOSEST         ) { attractiveness =        this.getCloseness               ( judge ); }
        if ( attractionCriterion === ATTRACTION_RANDOM          ) { attractiveness =        Math.random(); }
    
        return attractiveness;
    }


	//-------------------------------------
	// get color saturation
	//-------------------------------------
	this.getColorSaturation = function()
	{
        //console.log( "getColorSaturation" );	

        let saturation = ZERO;
        
        let accumulatedMass = ZERO;
        
        for (let p=1; p<_phenotype.numParts; p++)
        {
            //console.log( _phenotype.parts[p].red + ", " + _phenotype.parts[p].green + ", " + _phenotype.parts[p].blue );
            
            accumulatedMass += _phenotype.parts[p].mass;
            
            let rgDiff = Math.abs( _phenotype.parts[p].red     - _phenotype.parts[p].green  );
            let rbDiff = Math.abs( _phenotype.parts[p].red     - _phenotype.parts[p].blue   );
            let gbDiff = Math.abs( _phenotype.parts[p].green   - _phenotype.parts[p].blue   );

            //console.log( rgDiff + ", " + rbDiff + ", " + gbDiff );
            
            let thisPartSaturation = ( rgDiff + rbDiff + gbDiff ) / 3;

            assert( thisPartSaturation <= ONE, "thisPartSaturation <= ONE" );

            thisPartSaturation *= _phenotype.parts[p].mass
            
            saturation += thisPartSaturation;
        }
        
        assert( accumulatedMass > ZERO, "getColorSaturation: accumulatedMass > ZERO" );
        
        saturation /= accumulatedMass;

        assert( saturation <= ONE, "getColorSaturation: saturation <= ONE" );
            
        return saturation;
    }

    

	//-----------------------------------------
	// get closeness
	//-----------------------------------------
	this.getCloseness = function( judge )
	{
	    //console.log( "getCloseness" );
	    
        let closest = SWIMBOT_VIEW_RADIUS; //maximum
        
        let distance = _position.getDistanceTo( judge.getPosition() );
            
        /*    
        if ( distance > SWIMBOT_VIEW_RADIUS )
        {
            console.log( distance + ", " + SWIMBOT_VIEW_RADIUS );
        }
        
        //assert( distance <= SWIMBOT_VIEW_RADIUS, "swimbot.js: getCloseness: distance <= SWIMBOT_VIEW_RADIUS" );
        */
        
        if ( distance < closest )
        {
            closest = distance;
        }
        
        return ONE - ( closest / SWIMBOT_VIEW_RADIUS );
    }
    
    


	//-----------------------------------------
	// get similarity
	//-----------------------------------------
	this.getSimilarity = function( judge )
	{
	    let amount
	    = this.getColorSimilarity       ( judge )
	    + this.getBignessSimilarity     ( judge )
	    + this.getHypernessSimilarity   ( judge )
	    + this.getLengthSimilarity      ( judge )
	    + this.getStraightessSimilarity ( judge );
	    
	    amount /= 5; 
	    	    	    
	    return amount;
    }
    

	//-----------------------------------------
	// get color similarity
	//-----------------------------------------
	this.getColorSimilarity = function( judge )
	{
	    let amount = ZERO;
	    
	    let c1 = judge.getAverageColor();
	    let c2 = this.getAverageColor();
	    
	    //console.log( "judge color = " + c1.red + ", " + c1.green + ", " + c1.blue );
	    //console.log( "my color    = " + c2.red + ", " + c2.green + ", " + c2.blue );
            
        let rDiff = Math.abs( c2.red    - c1.red    );
        let gDiff = Math.abs( c2.green  - c1.green  );
        let bDiff = Math.abs( c2.blue   - c1.blue   );

        amount = ONE - ( ( rDiff + gDiff + bDiff ) * ONE_THIRD );
	    	    
	    return amount;
    }
    

	//--------------------------------------------
	// get bigness similarity
	//--------------------------------------------
	this.getBignessSimilarity = function( judge )
	{
	    let amount = ZERO;
	    
	    let b1 = judge.getCurrentBodyBigness();
	    let b2 = this.getCurrentBodyBigness();

        amount = ONE - Math.abs( b1 - b2 );
	    
        //console.log( "bigness similarity = " + amount );
	    	    
	    return amount;
    }
    
        
	//--------------------------------------------
	// get hyperness similarity
	//--------------------------------------------
	this.getHypernessSimilarity = function( judge )
	{
	    let amount = ZERO;
	    
	    let b1 = judge.getCurrentBodyHyperness();
	    let b2 = this.getCurrentBodyHyperness();

        amount = ONE - Math.abs( b1 - b2 );
	    	    	    
	    return amount;
    }
    
        
	//--------------------------------------------
	// get length similarity
	//--------------------------------------------
	this.getLengthSimilarity = function( judge )
	{
	    let amount = ZERO;
	    
	    let b1 = judge.getCurrentBodyLongness();
	    let b2 = this.getCurrentBodyLongness();

        amount = ONE - Math.abs( b1 - b2 );
	    	    	    
	    return amount;
    }
    
        
	//--------------------------------------------
	// get straightness similarity
	//--------------------------------------------
	this.getStraightessSimilarity = function( judge )
	{
	    let amount = ZERO;
	    
	    let b1 = judge.getCurrentBodyStraightness();
	    let b2 = this.getCurrentBodyStraightness();

        amount = ONE - Math.abs( b1 - b2 );
	    	    	    
	    return amount;
    }
    
        
    

    //---------------------------------------
    this.getCurrentBodyBigness = function()
    {
        let amount = _phenotype.mass / GREATEST_POSSIBLE_SWIMBOT_MASS;
      
        return amount;
    }
    

    //---------------------------------------
    this.getCurrentBodyLongness = function()
    {
        let amount = ZERO;
    
        for (let p=1; p<_phenotype.numParts; p++)
        {    
            for (let pp=1; pp<_phenotype.numParts; pp++)
            {
                if ( pp != p )
                {
                    let d = _phenotype.parts[p].midPosition.getDistanceTo( _phenotype.parts[pp].midPosition );
                    
                    if ( d > amount )
                    {
                        amount = d;
                    }
                }
            }
        } 

        amount /= GREATEST_POSSIBLE_SWIMBOT_LENGTH;    
    
        return amount;
    }
    
    
    


    //-------------------------------------------
    this.getCurrentBodyStraightness = function()
    {
        let amount = ZERO;
         
        //-------------------------------------------------------------------
        // normalized vectors for each part axis
        //-------------------------------------------------------------------
        let v = new Array();
        for (let p=1; p<_phenotype.numParts; p++)
        {
            v[p] = new Vector2D();
v[p].setXY( _phenotype.parts[p].axis.x / _phenotype.parts[p].length, _phenotype.parts[p].axis.y / _phenotype.parts[p].length );
            
//v[p].setToDifference( _phenotype.parts[ _phenotype.parts[p].parent ].position, _phenotype.parts[p].position );
//v[p].normalize();
        }
        
        //---------------------------------------------------------------------------
        // finding the dot products between each pair of these vectors...
        //---------------------------------------------------------------------------
        if ( _phenotype.numParts < 3 ) 
        {
            amount = ONE;
        }
        else
        {
            let numTests = 0;
            for (let p=1; p<_phenotype.numParts; p++)
            {
                for (let pp=p+1; pp<_phenotype.numParts; pp++)
                {
                    numTests ++;
                    assert ( p != pp, "Swimbot:getCurrentBodyStraightness: p != pp" );
                    amount += Math.abs( v[p].dotWith( v[pp] ) );                    
                }
            }
        
            amount /= numTests;
        }

        //-----------------------------------------------
        // let's favor swimbots with more parts....
        //-----------------------------------------------
        amount *= 0.7;
        amount += ( _phenotype.numParts / MAX_PARTS ) * 0.3;    
    
        if ( amount > ONE )
        {
            amount = ONE;
        }
                
        return amount;
    }




    //-------------------------------------------
    this.getCurrentBodyHyperness = function()
    {
        let amount = ZERO;
    
        for (let p=1; p<_phenotype.numParts; p++)
        {
            amount += _phenotype.parts[p].velocity.getMagnitude();
        }

        let FugdeFactorToScaleHyperAttraction = 0.4;
          
        amount *= FugdeFactorToScaleHyperAttraction;
        
        if ( amount > ONE )
        {
            amount = ONE;
        }
         
        return amount;
    }


    
	//---------------------------------
	// get average color
	//---------------------------------
	this.getAverageColor = function()
	{
        let r = ZERO;
        let g = ZERO;
        let b = ZERO;
        let accumulatedMass = ZERO;
        
        for (let p=1; p<_phenotype.numParts; p++)
        {
            accumulatedMass += _phenotype.parts[p].mass;
        
            r += _phenotype.parts[p].red    * _phenotype.parts[p].mass;
            g += _phenotype.parts[p].green  * _phenotype.parts[p].mass;
            b += _phenotype.parts[p].blue   * _phenotype.parts[p].mass;
        }
        
        assert( accumulatedMass > ZERO, "getAverageColor: accumulatedMass > ZERO" );
        
        r /= accumulatedMass;
        g /= accumulatedMass;
        b /= accumulatedMass;
    
        assert( r <= ONE, "getAverageColor: r <= ONE" );
        assert( g <= ONE, "getAverageColor: g <= ONE" );
        assert( b <= ONE, "getAverageColor: b <= ONE" );
    
        let c = new Color();
        c.red   = r;
        c.green = g;
        c.blue  = b;
        
        return c;
    }


    
	//-----------------------
	// die
	//----------------------
	this.die = function()
	{
        _alive = false;
	    
	    //assert( _index != NULL_INDEX, "Swimbot.js: this.die: _index != NULL_INDEX" )
	    if ( _index != NULL_INDEX )
	    {
	        // this is used for updating the FamilyTree
            _parent.notifySwimbotDeathTime( _index );
        }
    }
    
    
	//-----------------------
	// clear all data
	//----------------------
	this.clear = function()
	{
        _lastPositionForEfficiencyMeasurement.clear();
        _genotype.clear(); 
        _position.clear();
        _velocity.clear();
        _acceleration.clear();
        _heading.clear();
        _directionToGoal.clear();
        _focusDirection.clear();
        _centerOfMass.clear();
        _vectorUtility.clear();

        _chosenFoodBit      = null; 
        _chosenMate         = null; 
        _age 	  		    = 0;
        _numOffspring       = 0;
        _numFoodBitsEaten   = 0;
        _index              = NULL_INDEX;
        _chosenMateIndex    = NULL_INDEX;
        _chosenFoodBitIndex = NULL_INDEX;
        _alive 	  		    = false;
        _tryingToMate       = false;
        _tryingToEat        = false;
        _growthScale        = ZERO;
        _torque             = ZERO;
        _angle			    = ZERO;
        _spin			    = ZERO;
        _energy			    = ZERO;
        _timer              = ZERO;
        _timerDelta         = ZERO;
        _energyEfficiency   = ZERO;
        _selectRadius       = ZERO;	
        _lastEnergyForEfficiencyMeasurement = ZERO;
        _readyforSensoryInputToBrain = false;
    }
    

	//--------------------------
	// contribute to offspring
	//--------------------------
	this.contributeToOffspring = function()
	{
        //console.log( "" );
        //console.log( "-------------------------" );
        //console.log( "swimbot has energy of " + _energy );

/*
        assert( _childEnergyRatio >= ZERO, "_childEnergyRatio >= ZERO" );
        assert( _childEnergyRatio <= ONE, "_childEnergyRatio <= ONE"  );
        
console.log( "contributeToOffspring: _childEnergyRatio = " + _childEnergyRatio );
*/
        
//let energyToContribute = _energy * _childEnergyRatio;
        let energyToContribute = _energy * globalTweakers.childEnergyRatio;

//GLOBAL_childEnergyRatio
//console.log( "GLOBAL_childEnergyRatio = " + GLOBAL_childEnergyRatio );

        //console.log( "contributeToOffspring: energyToContribute " + energyToContribute );

/*
        //----------------------------------------------------------------------
        // I think I did this to keep babies hungry as soon as born... 
        //----------------------------------------------------------------------
	    if ( energyToContribute > DEFAULT_SWIMBOT_HUNGER_THRESHOLD * ONE_HALF )
	    {
	        energyToContribute = DEFAULT_SWIMBOT_HUNGER_THRESHOLD * ONE_HALF;
	    }
*/	    
	    
	    _energy -= energyToContribute;

        assert( _energy >= ZERO, "Swimbot: contributeToOffspring: _energy >= ZERO" );
   
	    _numOffspring ++;
   
        _timerDelta         = ZERO;
        _tryingToMate       = false;
        _chosenMate         = null;
        _chosenMateIndex    = NULL_INDEX
        _brain.setFoundSwimbot( false );

	    return energyToContribute;

	
	    //previous version that uses half of the swimbot's energy
        /*	
	    _numOffspring ++;
	
        let energyBeforeContribution = _energy;

        if (( _childEnergyRatio < ZERO )
        ||  ( _childEnergyRatio > ONE  ))
        {
            assert( _childEnergyRatio >= ZERO, "_childEnergyRatio >= ZERO" );
            assert( _childEnergyRatio <= ONE, "_childEnergyRatio <= ONE"  );
        }

        //console.log( _childEnergyRatio );

        _energy *= ( ONE - _childEnergyRatio ); 

        _timerDelta = ZERO;

        let energyToContribute = energyBeforeContribution - _energy;
    
        //cancel out all mate-related data so it doesn't get in the way next time..	
        _tryingToMate = false;
        _chosenMate = null;
        _chosenMateIndex = NULL_INDEX
        _brain.setFoundSwimbot( false );

        //printf( "swimbot %d just gave %f to %d, leaving it with %f\n", index, energyToContribute, energy );
        
	    return energyToContribute;
	    */
	    
    }



	//-------------------------------------------
	// set rendering goals
	//-------------------------------------------
	this.setRenderingGoals = function(r)
	{	
	    _swimbotRenderer.setRenderingGoals(r);
    }
    
	//-------------------------------------
	// render
	//-------------------------------------
	this.render = function( levelOfDetail )
	{
	    _swimbotRenderer.render
	    ( 
	        _phenotype, 
	        _brain, 
	        _age,
	        _energy,
	        _growthScale, 
	        _focusDirection,
	        levelOfDetail
	    );

              


/// debug test!!!!! 
// I'm adding these colored circles to visualize food preferences...  
/*       
canvas.lineWidth = 2;

if ( _phenotype.preferredFoodType == 0 )
{
    canvas.strokeStyle = "rgb( 100, 255, 100 )";	
    canvas.beginPath();
    canvas.arc( _position.x, _position.y, 60, 0, PI2, false );
    canvas.stroke();
    canvas.closePath();	
}
else
{
    canvas.strokeStyle = "rgb( 100, 150, 255 )";	
    canvas.beginPath();
    canvas.arc( _position.x, _position.y, 60, 0, PI2, false );
    canvas.stroke();
    canvas.closePath();	
}

if (_phenotype.digestibleFoodType == 0 )
{
    canvas.strokeStyle = "rgb( 100, 255, 100 )";	
    canvas.beginPath();
    canvas.arc( _position.x, _position.y, 45, 0, PI2, false );
    canvas.stroke();
    canvas.closePath();	
}
else
{
    canvas.strokeStyle = "rgb( 100, 150, 255 )";	
    canvas.beginPath();
    canvas.arc( _position.x, _position.y, 45, 0, PI2, false );
    canvas.stroke();
    canvas.closePath();	
}
*/


	    /*
		//-------------------------------------
		// show position
		//-------------------------------------
		canvas.fillStyle = "rgb( 244, 244, 244 )";	
		canvas.beginPath();
		canvas.arc( _position.x, _position.y, 2.0, 0, PI2, false );
		canvas.fill();
		canvas.closePath();	
        
		//-----------------------------------------
		// show heading
		//-----------------------------------------
        canvas.strokeStyle = "rgb( 233, 233, 233 )";	

        canvas.lineWidth = 1; 
        canvas.beginPath();
        canvas.moveTo( _position.x, _position.y );
        canvas.lineTo( _position.x + _heading.x * 40.0, _position.y + _heading.y * 40.0 );
        canvas.closePath();
        canvas.stroke();
	    */	    
	}
    
}//end of entire Swimbots function -------------------------







// === simulation/Touch.js ===
//--------------------------------------------------------------------------
//                                                                        
//    This file is part of GenePool Swimbots.                             
//    Copyright (c) 2021 by Jeffrey Ventrella - All Rights Reserved.      
//                                                                        
//    See the README file or go to swimbots.com for full license details.           
//    You may use, distribute, and modify this code only under the terms  
//    of the "Commons Clause" license (commonsclause.com).                
//                                                                        
//    This software is intended for education, game design, and research. 
//                                                                        
// -------------------------------------------------------------------------- 

"use strict";

//------------------------------
// touch states
//------------------------------
const TouchState = 
{
    NULL      : -1,
    BEEN_UP   :  0,
    JUST_DOWN :  1,
    BEEN_DOWN :  2,
    JUST_UP   :  3
};


//----------------------------
function Touch()
{
    let _state = TouchState.BEEN_UP;
    let _x = ZERO;
    let _y = ZERO;
    let _previousX = ZERO;
    let _previousY = ZERO;
    
    //------------------------------
    // update
    //------------------------------
	this.update = function() 
	{ 
    	_previousX = _x;
    	_previousY = _y;

	    if ( _state === TouchState.JUST_DOWN )
	    {
	        _state = TouchState.BEEN_DOWN;
	    }
	    else if ( _state === TouchState.JUST_UP )
	    {
	        _state = TouchState.BEEN_UP;
	    }    	
	}
    
    //-------------------------------------
    // set to down
    //-------------------------------------
	this.setToDown = function( x, y ) 
	{ 
	    _x = x; 
	    _y = y; 
	    _state = TouchState.JUST_DOWN;
    }    
    
    //-------------------------------------
    // set to up
    //-------------------------------------
	this.setToUp = function( x, y ) 
	{ 
	    _x = x; 
	    _y = y; 
	    _state = TouchState.JUST_UP;
    }    

    //-------------------------------------
    // set to move
    //-------------------------------------
	this.setToMove = function( x, y  ) 
	{ 
	    _x = x; 
	    _y = y; 
	}    
	
    //------------------------------
    // render
    //------------------------------
	this.render = function() 
	{ 
		if ( _state === TouchState.BEEN_UP   ) { canvas.fillStyle = "rgb(   0,   0,   0 )"; }
		if ( _state === TouchState.JUST_DOWN ) { canvas.fillStyle = "rgb( 244, 244, 244 )"; }
		if ( _state === TouchState.BEEN_DOWN ) { canvas.fillStyle = "rgb(   0, 244,   0 )"; }
		if ( _state === TouchState.JUST_UP   ) { canvas.fillStyle = "rgb( 244,   0,   0 )"; }
		
		canvas.beginPath();
        canvas.arc( _x, _y, 10.0, 0, PI2, false );
		canvas.fill();
		canvas.closePath();
	}    
	
    //-----------------------------------------------
    // get methods
    //-----------------------------------------------
	this.getState      = function() { return _state; }    
	this.getVelocityX  = function() { return _x - _previousX; }    
	this.getVelocityY  = function() { return _y - _previousY; }    
}


// === simulation/ViewTracking.js ===
//--------------------------------------------------------------------------
//                                                                        
//    This file is part of GenePool Swimbots.                             
//    Copyright (c) 2021 by Jeffrey Ventrella - All Rights Reserved.      
//                                                                        
//    See the README file or go to swimbots.com for full license details.           
//    You may use, distribute, and modify this code only under the terms  
//    of the "Commons Clause" license (commonsclause.com).                
//                                                                        
//    This software is intended for education, game design, and research. 
//                                                                        
// -------------------------------------------------------------------------- 

"use strict";

const ViewTrackingMode = 
{
    NULL        : -1,
    WHOLE_POOL  :  0,
    AUTOTRACK   :  1,
    SELECTED    :  2,
    MUTUAL      :  3,
    PROLIFIC    :  4,
    EFFICIENT   :  5,
    VIRGIN      :  6,
    HUNGRY      :  7
};



//----------------------
function ViewTracking()
{	
    const LOVER_TRACKING_SCALE_BASE = 0//200;
    const LOVER_TRACKING_SCALE_INC  = 2.0;
    const DEFAULT_INERTIA           = 0.4;
    const EASE_IN_FRACTION          = 15.0;
    const INNER_WINDOW_RATIO        = 0.1;
    
    let _vectorUtility      = new Vector2D();
     let _centroidUtility    = new Vector2D();
     let _isTracking         = false;
    let _trackingEaseIn     = ZERO;
    let _trackingPosition   = new Vector2D();
    let _trackingScale      = POOL_WIDTH;
    let _inertia            = DEFAULT_INERTIA;
    let _cameraForce        = new Vector2D();
    let _cameraScaleForce   = ZERO;
    let _swimbots           = new Array();
    let _mode               = ViewTrackingMode.AUTOTRACK;
    let _lover1Index        = NULL_INDEX;
    let _lover2Index        = NULL_INDEX;
    
    //-------------------------------------------------
    // set this to the default
    //-------------------------------------------------
    _vectorUtility.x = POOL_X_CENTER;
    _vectorUtility.y = POOL_Y_CENTER;
    _trackingPosition.copyFrom( _vectorUtility );        

    //--------------------------------------------
    // should this use a "copyFrom" function?
    //--------------------------------------------
    this.setSwimbots = function( swimbots ) 
    { 
        _swimbots = swimbots; 
    }
            
            
    //-----------------------------------------------------------------------------------------
    this.setMode = function( mode, currentCameraPosition, currentCameraScale, selectedSwimbot )
    {
        //console.log( "ViewTracking.setMode: " + mode );    
    
        _mode = mode;
    
        _isTracking = false;
        _trackingPosition.copyFrom( currentCameraPosition );
//_trackingScale = POOL_WIDTH;
        _trackingEaseIn = ZERO;
        _inertia  = DEFAULT_INERTIA;        
        
        //-----------------------------------------------
        // whole pool
        //-----------------------------------------------
        if ( _mode === ViewTrackingMode.WHOLE_POOL )
        {
            _isTracking = true;
            _trackingScale = POOL_WIDTH;
            _inertia = 0.1;      
        }
        //-----------------------------------------------
        // autotrack
        //-----------------------------------------------
        else if ( _mode === ViewTrackingMode.AUTOTRACK ) 
        {     
            //console.log( "_mode is ViewTrackingMode.AUTOTRACK" );    
  
            _isTracking = true;
            _trackingScale = 600;
            //_inertia = 0.05;      
            _inertia = 0.1;      
        } 
        //-----------------------------------------------
        // selected swimbot
        //-----------------------------------------------
        else if ( _mode === ViewTrackingMode.SELECTED ) 
        {
            if ( selectedSwimbot != NULL_INDEX )
            {
                _isTracking = true;
                _trackingScale = 400;
                document.getElementById( 'swimbotDataPanel' ).innerHTML = "";
            }
        }
        //-----------------------------------------------
        // mutual love
        //-----------------------------------------------
        else if ( _mode === ViewTrackingMode.MUTUAL ) 
        {
            _trackingPosition.copyFrom( getCentroidOfLovers() );

            if (( _lover1Index != NULL_INDEX )
            &&  ( _lover2Index != NULL_INDEX ))
            {
                _isTracking = true;
//_trackingScale = LOVER_TRACKING_SCALE_BASE;
            }
        }
        //-----------------------------------------------
        // prolific
        //-----------------------------------------------
        else if ( _mode === ViewTrackingMode.PROLIFIC ) 
        {
            let mostProlific = getMostProlificSwimbot();

            if ( mostProlific != NULL_INDEX )
            {
                selectedSwimbot = mostProlific;
            
                _isTracking = true;
                _trackingScale = 500;
                document.getElementById( 'swimbotDataPanel' ).innerHTML = "";
            }
        } 
        //-----------------------------------------------
        // most efficient
        //-----------------------------------------------
        else if ( _mode === ViewTrackingMode.EFFICIENT   ) 
        {
            let mostEfficient = getMostEfficientSwimbot();

            if ( mostEfficient != NULL_INDEX )
            {
                selectedSwimbot = mostEfficient;
            
                _isTracking = true;
                _trackingScale = 500;
                document.getElementById( 'swimbotDataPanel' ).innerHTML = "";
            }
        }
        //-----------------------------------------------
        // oldest virgin
        //-----------------------------------------------
        else if ( _mode === ViewTrackingMode.VIRGIN ) 
        {
            let oldestVirgin = getOldestVirgin();

            if ( oldestVirgin != NULL_INDEX )
            {
                selectedSwimbot = oldestVirgin;
            
                _isTracking = true;
                _trackingScale = 500;
                document.getElementById( 'swimbotDataPanel' ).innerHTML = "";
            }
        }
        //-----------------------------------------------
        // hungriest
        //-----------------------------------------------
        else if ( _mode === ViewTrackingMode.HUNGRY ) 
        {
            let biggestEater = getBiggestEater();

            if ( biggestEater != NULL_INDEX )
            {
                selectedSwimbot = biggestEater;
            
                _isTracking = true;
                _trackingScale = 500;
                document.getElementById( 'swimbotDataPanel' ).innerHTML = "";
            }
        }
        
        return selectedSwimbot;
    }
    
    
    //-----------------------
    this.reset = function()
    {
        _lover1Index = NULL_INDEX;
        _lover2Index = NULL_INDEX;
    }
    

            
    //--------------------------------
    this.startTracking = function()
    {
        _isTracking = true;
    }
    
    //--------------------------------
    this.stopTracking = function()
    {
        _isTracking = false;
        _mode = ViewTrackingMode.NULL;
    }
    
    //-------------------------------------------------------------------------------------------------
    this.updateTracking = function( currentCameraPosition, currentCameraScale, selectedSwimbot )
    {
        if ( _mode === ViewTrackingMode.AUTOTRACK )
        {                    
            _trackingPosition.copyFrom( getCentroidOfVisibleSwimbots() );  
        }
        else if ( _mode === ViewTrackingMode.MUTUAL )
        {
            if (( _lover1Index != NULL_INDEX )
            &&  ( _lover2Index != NULL_INDEX ))
            {
                let loverDistance = _swimbots[ _lover1Index ].getPosition().getDistanceTo( _swimbots[ _lover2Index ].getPosition() );  
                
                // tone it down dudes! FIX...  
//let trackingScaleTarget = LOVER_TRACKING_SCALE_BASE + loverDistance * LOVER_TRACKING_SCALE_INC;
//_trackingScale += ( trackingScaleTarget - _trackingScale ) * 0.01;
                
//_trackingScale = trackingScaleTarget;

_trackingScale += ( ( loverDistance * 2 ) - _trackingScale ) * 0.1;
                
            }

            _trackingPosition.copyFrom( getCentroidOfLovers() );     
        } 
        else
        {
            if ( selectedSwimbot != NULL_INDEX )
            {                    
                _trackingPosition.copyFrom( _swimbots[ selectedSwimbot ].getPosition() );
            }
        }     
        
        //----------------------------------------------------------------
        // This is where the tracking forces are created......
        //----------------------------------------------------------------    
// goals: 
// DONE - NEEDS TESTING    improve ease-in
// DONE - NEEDS TESTING    make camera stop when forces go below a minimum
// make whole pool go slower        
// for autotracking, make drop off with distance 
// for transition, make scale go up and then down
        
        let xx = _trackingPosition.x - currentCameraPosition.x;
        let yy = _trackingPosition.y - currentCameraPosition.y;
        
        //---------------------------------------------------------------------------
        // this is where we handle the inner-window having no tracking force...
        //---------------------------------------------------------------------------
        let min = currentCameraScale * INNER_WINDOW_RATIO;
        
        let d = Math.sqrt( xx * xx + yy * yy );
        
        if ( d < min ) 
        { 
            _cameraForce.x = ZERO;
            _cameraForce.y = ZERO;               
        }
        else
        { 
            let ramp = ( d - min ) / currentCameraScale;
            
            if ( ramp > ONE )
            {
                ramp = ONE;
            }
            
            _cameraForce.x = xx * _inertia * ramp;
            _cameraForce.y = yy * _inertia * ramp;               
        }
        
        //-----------------------------------------------------------------------------------
        // set scale force
        //-----------------------------------------------------------------------------------
        _cameraScaleForce = ( _trackingScale - currentCameraScale ) * _inertia;
        
        //-------------------------------------
        // handle ease-in effect
        //-------------------------------------
        _trackingEaseIn += EASE_IN_FRACTION;

        let distance = _cameraForce.getMagnitude();

        if ( distance > _trackingEaseIn )
        {
            if ( distance > ZERO )
            {
                _cameraForce.x = ( _cameraForce.x / distance ) * _trackingEaseIn;
                _cameraForce.y = ( _cameraForce.y / distance ) * _trackingEaseIn;
            }
        }

        if ( _cameraScaleForce < -_trackingEaseIn ) { _cameraScaleForce   = -_trackingEaseIn; }
        if ( _cameraScaleForce >  _trackingEaseIn ) { _cameraScaleForce   =  _trackingEaseIn; }
    }
    
    
    
    

    //----------------------------------------------------------------
    // some quickie get functions....
    //----------------------------------------------------------------    
    this.getIsTracking          = function() { return _isTracking;      }
    this.getMode                = function() { return _mode;            }
    this.getLover1Index         = function() { return _lover1Index;     }
    this.getLover2Index         = function() { return _lover2Index;     }
    this.getCameraForce         = function() { return _cameraForce      }
    this.getCameraScaleForce    = function() { return _cameraScaleForce }

    

    //--------------------------------------
    function getCentroidOfVisibleSwimbots()
     {
         //let num = 0;
         let totalWeight = ZERO;
         _centroidUtility.clear();
         
        for (let s=0; s<MAX_SWIMBOTS; s++)
        {
            let xx = _swimbots[s].getPosition().x - _trackingPosition.x;
            let yy = _swimbots[s].getPosition().y - _trackingPosition.y;
            
            let distance = Math.sqrt( xx*xx + yy*yy );
            
            if ( distance < _trackingScale )
            {
                if ( _swimbots[s].getAlive() )
                {
                    let weight = ONE - ( distance / _trackingScale );
                    
                    //assert( weight <= ONE,  "weight <= ONE"  );
                    //assert( weight >= ZERO, "weight >= ZERO" );
                    
                    _centroidUtility.addScaled( _swimbots[s].getPosition(), weight );
                    //num ++;
                    totalWeight += weight;
                }
            }
        }

        if ( totalWeight > ZERO )
        //if ( num > 0 )
        {
            //_centroidUtility.scale( ONE / num );
             _centroidUtility.scale( ONE / totalWeight );
        }
        else
        {
            let closestSwimbot = getClosestSwimbotToTrackingPosition();

            if ( closestSwimbot != NULL_INDEX )
                  {
                      _centroidUtility.copyFrom( _swimbots[ closestSwimbot ].getPosition() );   
                  }
                  else
                  {
                      _centroidUtility.copyFrom( _trackingPosition );   
                  }
              }
            
              return _centroidUtility;
            }




    //---------------------------------------------
    function getClosestSwimbotToTrackingPosition()
    {
        let closest = NULL_INDEX;
        let smallestDistance = POOL_WIDTH;
        
        for (let s=0; s<MAX_SWIMBOTS; s++)
        {
            if ( _swimbots[s].getAlive() )
            {
                let distance = _swimbots[s].getPosition().getDistanceTo( _trackingPosition );

                if ( distance < smallestDistance )
                {
                    smallestDistance = distance;
                    closest = s;
                }
            }
        }
                
        return closest
    }    
    
    
    //---------------------------------
    function getMostProlificSwimbot()
    {		
        let mostNumOffspring = 0;
        let mostProlific = 0;

        for (let s=0; s<MAX_SWIMBOTS; s++)
        {
            if ( _swimbots[s].getAlive() )
            {
                let numOffspring = _swimbots[s].getNumOffspring();
            
                if ( numOffspring > mostNumOffspring )
                {
                    mostNumOffspring = numOffspring;
                    mostProlific = s;
                }
            }
        }

        return mostProlific;
    }	    
    
    //----------------------------------
    function getMostEfficientSwimbot()
    {		
        let highestEfficiency = 0;
        let mostEfficient = NULL_INDEX;

        for (let s=0; s<MAX_SWIMBOTS; s++)
        {
            if ( _swimbots[s].getAlive() )
            {
                if ( _swimbots[s].getNumOffspring() === 0 )
                {
                    let efficiency = _swimbots[s].getEnergyEfficiency();
            
                    if ( efficiency > highestEfficiency )
                    {
                        highestEfficiency = efficiency;
                        mostEfficient = s;
                    }
                }
            }
        }

        return mostEfficient;
    }
    
    //--------------------------
    function getOldestVirgin()
    {		
        let highestAge = 0;
        let oldestVirgin = NULL_INDEX;

        for (let s=0; s<MAX_SWIMBOTS; s++)
        {
            if ( _swimbots[s].getAlive() )
            {
                if ( _swimbots[s].getNumOffspring() === 0 )
                {
                    let age = _swimbots[s].getAge();
            
                    if ( age > highestAge )
                    {
                        highestAge = age;
                        oldestVirgin = s;
                    }
                }
            }
        }

        return oldestVirgin;
    }
    
    //--------------------------
    function getBiggestEater()
    {		
        let mostEaten = 0;
        let biggestEater = NULL_INDEX;

        for (let s=0; s<MAX_SWIMBOTS; s++)
        {
            if ( _swimbots[s].getAlive() )
            {
                let numEaten = _swimbots[s].getNumFoodBitsEaten();
        
                if ( numEaten > mostEaten )
                {
                    mostEaten = numEaten;
                    biggestEater = s;
                }
            }
        }

        return biggestEater;
    }
    
    
    
    //-----------------------------
    function getCentroidOfLovers()
    {
        let centroid = new Vector2D();	 

        //-----------------------------------------------------------
        // set the centroid to the tracking position as the default
        //-----------------------------------------------------------
        centroid.copyFrom( _trackingPosition );   

        //-----------------------------------------------------------
        // start by assuming they are still in love
        //-----------------------------------------------------------
        let stillInLove = true;
        
        //-----------------------------------------------------------
        // check if either of the lovers has NULL_INDEX
        //-----------------------------------------------------------
        if (( _lover1Index === NULL_INDEX )
        ||  ( _lover2Index === NULL_INDEX ))
        {
            stillInLove = false;
        }
        
        //-----------------------------------------------------------
        // okay - if their indices are legit
        //-----------------------------------------------------------
        if ( stillInLove )
        {
            //--------------------------------------------
            // Check to see if the lovers have broken up
            //--------------------------------------------
            for (let s=0; s<MAX_SWIMBOTS; s++)
            {
                //-----------------------------------------------
                // is lover 1 still in love with lover 2?
                //-----------------------------------------------
                if ( s === _lover1Index )
                {
                    if ( _swimbots[s].getAlive() )
                    {
                        if (( _swimbots[s].getBrainState() != BRAIN_STATE_PURSUING_MATE )
                        ||  ( _swimbots[s].getChosenMateIndex() != _lover2Index ))
                        {
                            stillInLove = false;
                        }
                    }
                    else
                    {
                        stillInLove = false;
                    }
                }
            
                //---------------------------------------------------------------
                // if yes, then...is lover 2 still in love with lover 1?
                //---------------------------------------------------------------
                if ( stillInLove )
                {
                    if ( s === _lover2Index )
                    {
                        if ( _swimbots[s].getAlive() )
                        {
                            if (( _swimbots[s].getBrainState() != BRAIN_STATE_PURSUING_MATE )
                            ||  ( _swimbots[s].getChosenMateIndex() != _lover1Index ))
                            {
                                stillInLove = false;
                            }
                        }
                        else
                        {
                            stillInLove = false;
                        }
                    }
                }
            }        
        }
        
        //-------------------------------------------------------------
        // okay, they parted ways - find two new lovers!
        //-------------------------------------------------------------
        if ( ! stillInLove )
        {
//console.log( "yea, not stillInLove" ); 
//console.log( "" );    
//console.log( "" );    
//console.log( "" );    
  

            for (let s=0; s<MAX_SWIMBOTS; s++)
            {
                if ( _swimbots[s].getAlive() )
                {
                    if ( _swimbots[s].getBrainState() === BRAIN_STATE_PURSUING_MATE )
                    {
                        let chosenMate = _swimbots[s].getChosenMateIndex();
                        
//console.log( "lover " + s + " is going after " + chosenMate );    
                        
                        for (let o=0; o<MAX_SWIMBOTS; o++)
                        {
                            if ( o === chosenMate )
                            {
//console.log( "here's " + o );    
                                if ( _swimbots[o].getAlive() )
                                {
//console.log( o + " is alive" );    
                                    if ( _swimbots[o].getBrainState() === BRAIN_STATE_PURSUING_MATE )
                                    {
//console.log( "lover " + o + " is going after " + _swimbots[o].getChosenMateIndex() );    
                                        if ( _swimbots[o].getChosenMateIndex() === s )
                                        {
//console.log( o + " likes " + s );    
//console.log( "*********************************************************************************" );    
//console.log( "lover " + s + " is going after " + _swimbots[s].getChosenMateIndex() );    
//console.log( "lover " + o + " is going after " + _swimbots[o].getChosenMateIndex() );    
                                    
                                            _lover1Index = s;
                                            _lover2Index = o;
                                            
//console.log( " _lover1Index = " + _lover1Index );    
//console.log( " _lover2Index = " + _lover2Index );    
                                      
                                            
                                            
                                            assert( _lover1Index != _lover2Index, "getCentroidOfLovers: _lover1Index != _lover2Index" );
                                            
                                            //_loverDistance = _swimbots[s].getPosition().getDistanceTo( _swimbots[o].getPosition );
                                        }
                                    }
                                }
                            }
                        }                        
                    }
                }
            }
        }

        //----------------------------------------------------------
        // get the centroid of the two lovers and send it off
        //----------------------------------------------------------
        if (( _lover1Index != NULL_INDEX )
        &&  ( _lover2Index != NULL_INDEX ))
        {
            centroid.x = ( _swimbots[ _lover1Index ].getPosition().x + _swimbots[ _lover2Index ].getPosition().x ) * ONE_HALF;
            centroid.y = ( _swimbots[ _lover1Index ].getPosition().y + _swimbots[ _lover2Index ].getPosition().y ) * ONE_HALF;
        }
    
        return centroid;
    }
}


// === simulation/FamilyTree.js ===
//--------------------------------------------------------------------------
//                                                                        
//    This file is part of GenePool Swimbots.                             
//    Copyright (c) 2021 by Jeffrey Ventrella - All Rights Reserved.      
//                                                                        
//    See the README file or go to swimbots.com for full license details.           
//    You may use, distribute, and modify this code only under the terms  
//    of the "Commons Clause" license (commonsclause.com).                
//                                                                        
//    This software is intended for education, game design, and research. 
//                                                                        
// -------------------------------------------------------------------------- 

"use strict";


function FamilyTree()
{
    function FamilyTreeNode()
    {
        //based on the index of the swimbot in the pool at the time the node was reated
        this.poolIndex          = NULL_INDEX;
        this.parent1PoolIndex   = NULL_INDEX;
        this.parent2PoolIndex   = NULL_INDEX;
        
        // consistent with the indeces in the node array
        this.parent1Index   = NULL_INDEX;   
        this.parent2Index   = NULL_INDEX;   
                
        this.birthTime  = 0;
        this.deathTime  = 0;
        this.genes      = new Array();
    }

    let _nodes = new Array();  
     let _numNodes = 0;  
     const MAX_FAMILY_TREE_NODES = 50000;
    
    //-----------------------
    this.reset = function()
    {
        _numNodes = 0;
        _nodes = [];
        _nodes.length = 0;
    }
    
    //----------------------------------------------------
    this.setDeathTime = function( poolIndex, deathTime )
    {
	    assert( poolIndex != NULL_INDEX, "FamilyTree.js: this.setDeathTime: poolIndex != NULL_INDEX" )
    
        let index = getIndexFromPoolIndex( poolIndex );
        
        //assert( index > NULL_INDEX, "family tree: setDeathTime: index > NULL_INDEX" );
        
        if ( index > NULL_INDEX )
        {
            _nodes[ index ].deathTime = deathTime;
        }
    }
    
    
    //-------------------------------------------------------------------------------------------
      this.addNode = function( poolIndex, parent1PoolIndex, parent2PoolIndex, birthTime, genes )
      {
          if ( _numNodes >= MAX_FAMILY_TREE_NODES )
          {
              return;
          }

          //calulate the proper parent indices based on.....
    
        _nodes[ _numNodes ] = new FamilyTreeNode;
        _nodes[ _numNodes ].poolIndex           = poolIndex;
        _nodes[ _numNodes ].parent1PoolIndex    = parent1PoolIndex;
        _nodes[ _numNodes ].parent2PoolIndex    = parent2PoolIndex;
        _nodes[ _numNodes ].parent1Index        = getIndexFromPoolIndex( parent1PoolIndex );
        _nodes[ _numNodes ].parent2Index        = getIndexFromPoolIndex( parent2PoolIndex );
        _nodes[ _numNodes ].birthTime           = birthTime;
        _nodes[ _numNodes ].deathTime           = 0;
        
        for (let g=0; g<genes.length; g++)
        {
            _nodes[ _numNodes ].genes[g] = genes[g];
        }

        _numNodes ++;
    }
    
    //------------------------------------------
    function getIndexFromPoolIndex( poolIndex )
    {
        //----------------------------------------------------------
        // important to loop backwards...because pool index values
        // can reoccur as a result of pool swimbot reincarnation. 
        //----------------------------------------------------------
        for (let n=_numNodes-1; n>=0; n--)
        {
            if ( poolIndex === _nodes[n].poolIndex )
            {
                return n;
            }
        }
        
        return NULL_INDEX;
    }
    
               
    //-----------------------------------------------------------------------------------------------------
    this.getNumNodes                = function(         ) { return _numNodes; }
    this.getNodeParent1Index        = function( index   ) { return _nodes[ index ].parent1Index;        }
    this.getNodeParent2Index        = function( index   ) { return _nodes[ index ].parent2Index;        }
    this.getNodePoolIndex           = function( index   ) { return _nodes[ index ].poolIndex;           }
    this.getNodeParent1PoolIndex    = function( index   ) { return _nodes[ index ].parent1PoolIndex;    }
    this.getNodeParent2PoolIndex    = function( index   ) { return _nodes[ index ].parent2PoolIndex;    }
    this.getNodeBirthTime           = function( index   ) { return _nodes[ index ].birthTime;           }
    this.getNodeDeathTime           = function( index   ) { return _nodes[ index ].deathTime;           }
    this.getNodeGenes               = function( index   ) { return _nodes[ index ].genes;               }
}


// === simulation/PhyloTree.js ===
//--------------------------------------------------------------------------
//                                                                        
//    This file is part of GenePool Swimbots.                             
//    Copyright (c) 2021 by Jeffrey Ventrella - All Rights Reserved.      
//                                                                        
//    See the README file or go to swimbots.com for full license details.           
//    You may use, distribute, and modify this code only under the terms  
//    of the "Commons Clause" license (commonsclause.com).                
//                                                                        
//    This software is intended for education, game design, and research. 
//                                                                        
// -------------------------------------------------------------------------- 

"use strict";

//------------------------
//  constants
//------------------------
const MAX_SPECIES = 200;
const MIN_SWIMBOTS_PER_SPECIES = 10;

//--------------------
function PhyloTree()
{
    //------------------
    function Species()
    {
        this.ID             = NULL_INDEX;
        this.parentID       = NULL_INDEX;
        this.mode           = new Array();
        this.numSwimbots    = 0;
        this.startTime      = 0;
        this.endTime        = 0;
    }
    
	//-----------------------
	// variables
	//-----------------------
    let _numSpecies = 0;
    let _numJunkGenes = 0;
    let _species = new Array( MAX_SPECIES );
    
    for (let s=0; s<MAX_SPECIES; s++)
    {
        _species[s] = new Species();
    }
    
	//-------------------------------------------
	this.initialize = function( numJunkGenes )
		{
	        _numSpecies = 0;

        for (let s=0; s<MAX_SPECIES; s++)
        {
            _species[s].numSwimbots = 0;
            _species[s].ID          = NULL_INDEX;
            _species[s].parentID    = NULL_INDEX;
            _species[s].startTime   = 0;
            _species[s].endTime     = 0;
        }

    	_numJunkGenes = numJunkGenes;
	}
    
	//------------------------------------------
	this.addJunkDNA = function( junkDNAArray )
	{
        for (let g=0; g<_numJunkGenes; g++)
        {
        }          	
    }
    
} // function PhyloTree()

	  
       


// === simulation/Obstacle.js ===
//--------------------------------------------------------------------------
//                                                                        
//    This file is part of GenePool Swimbots.                             
//    Copyright (c) 2021 by Jeffrey Ventrella - All Rights Reserved.      
//                                                                        
//    See the README file or go to swimbots.com for full license details.           
//    You may use, distribute, and modify this code only under the terms  
//    of the "Commons Clause" license (commonsclause.com).                
//                                                                        
//    This software is intended for education, game design, and research. 
//                                                                        
// -------------------------------------------------------------------------- 

"use strict";


//------------------------
// Obstacle
//------------------------
function Obstacle()
{
    const END_RADIUS = 20;
    const END_HOVER_RADIUS = 30;
    const END_MOVE_RADIUS  = 25;

    //----------------------------
    function ObstacleEndpoint()
    {
        this.position   = new Vector2D();
        this.hovered    = false;
        this.moved      = false;
        this.color      = "rgb( 100, 100, 100 )"
        
        //----------------------------
        this.setColor = function(c)
        {
            this.color = c;
        }
        
        //----------------------------
        this.setPosition = function(p)
        {
            this.position.x = p.x;
            this.position.y = p.y;
        }
        
        //----------------------------
        this.detectHover = function(p)
        {
            let x1 = p.x - this.position.x;
            let y1 = p.y - this.position.y;

            let d1 = x1 * x1 + y1 * y1;
        
            this.hovered = false;
            if ( d1 < END_HOVER_RADIUS * END_HOVER_RADIUS )
            {
                this.hovered = true; 
                return true;
            }

            return false;
        }
        
        //----------------------------
        this.render = function( camera )
        {
            canvas.fillStyle = this.color;	    
    
            canvas.beginPath();
            canvas.arc( this.position.x, this.position.y, END_RADIUS, 0, PI2, false );
            canvas.fill();
            canvas.closePath();	

            canvas.lineWidth = 0.003 * camera.getScale(); 	

            canvas.strokeStyle = "rgba( 0, 0, 0, 0.4 )";
            canvas.beginPath();
            canvas.arc( this.position.x, this.position.y, END_RADIUS, 0, PI2, false );
            canvas.stroke();
            canvas.closePath();	

            if ( this.hovered )
            {
                let r = END_HOVER_RADIUS;
                if ( this.moved )
                {
                    r = END_MOVE_RADIUS;
                }
            
                canvas.strokeStyle = "rgba(255, 255, 255, 0.4 )";
                canvas.beginPath();
                canvas.arc( this.position.x, this.position.y, r, 0, PI2, false );
                canvas.stroke();
                canvas.closePath();	
            }

        }
    } // end of obstacle endpoint
    
//const COLLISION_FORCE = 10;
//const COLLISION_FORCE = 1;

    //------------------------------------------
    // local variables
    //------------------------------------------
    let _end1           = new ObstacleEndpoint(); 
    let _end2           = new ObstacleEndpoint(); 
    let _mid            = new Vector2D();
    let _axis           = new Vector2D();
    let _direction      = new Vector2D();
    let _perp           = new Vector2D();
    let _testVector     = new Vector2D();
    let _collisionForce = new Vector2D();
    let _length         = ZERO;

    
    // set colors....
    _end1.setColor( "rgb( 200, 150, 100 )" );
    _end2.setColor( "rgb( 100, 150, 200 )" );

    //-------------------------------------------------
    // set the endpoints of the obstacle
    //------------------------------------------------
	this.setEndpointPositions = function( e1, e2 )
	{
	    _end1.setPosition( e1 );
	    _end2.setPosition( e2 );
	    
        //-----------------------------------
        // whenever an endpoint is moved...
        //-----------------------------------
        calculateStuff();
    }

    //------------------------------------------
    // start moving
    //------------------------------------------
	this.startMoving = function( movePosition )
	{
	    if ( _end1.hovered )
	    {
	        _end1.moved = true;
	        _end1.setPosition( movePosition );
	    }
	    else if ( _end2.hovered )
	    {
	        _end2.moved = true;
	        _end2.setPosition( movePosition );
	    }	 

        //-----------------------------------
        // whenever an endpoint is moved...
        //-----------------------------------
        calculateStuff();
    }
    
    //----------------------------------------------
    // move
    //----------------------------------------------
	this.setMovePosition = function( movePosition )
	{
        if ( _end1.moved )
        {     
            _end1.setPosition( movePosition );              
        }
        else if ( _end2.moved )
        {        	    
            _end2.setPosition( movePosition );   	    
        }
        
        //-----------------------------------
        // whenever an endpoint is moved...
        //-----------------------------------
        calculateStuff();
    }
    
    //-----------------------------------
    // stop moving
    //-----------------------------------
	this.stopMoving = function()
	{
	    _end1.moved = false;
        _end2.moved = false;        
    }
    
    
	//---------------------------------------------------
	// detect collision with a given position
	//---------------------------------------------------
	this.getCollision = function( testPosition, radius ) 
	{
	    if ( radius < END_RADIUS )
	    {
	        radius = END_RADIUS;
	    }
	    
	    let xx = testPosition.x - _mid.x;
	    let yy = testPosition.y - _mid.y;
	    
	    let distanceSquared = xx * xx + yy * yy;
	    
	    let ll = _length * ONE_HALF + END_RADIUS + radius;
	
	    if ( distanceSquared < ll * ll )
	    {
	        _testVector.x = testPosition.x - _end1.position.x;
	        _testVector.y = testPosition.y - _end1.position.y;
	        
	        let dot = _testVector.dotWith( _perp );
	        
	        if ( Math.abs( dot ) < radius )
	        {
	            let penetration = ( ONE - ( dot / radius ) ) /* * COLLISION_FORCE */;
	            
	            if ( dot < ZERO )
	            {
	                penetration *= -ONE;
	            }
	            
                _collisionForce.setXY( _perp.x * penetration, _perp.y * penetration );
    	        return true;
	        }
	    }
	    
	    return false; 
	}
	

	//-------------------------------------------------------------------
	// if a collision has been detected, then add the resulting force
	// NOTE: call this immediately after calling "getCollision"
	//-------------------------------------------------------------------
	this.getCurrentCollisionForce = function() 
	{
    	return _collisionForce;
    }

	//-------------------------------------------------------
	// See if the obstacle lies between these two points 
	// (blocking the view or stopping access)
	//-------------------------------------------------------
	this.getObstruction = function( p1, p2 ) 
	{
	    return p1.getSegmentsCrossing( p1, p2, _end1.position, _end2.position );
    }

	//------------------------------------------------------------------
	// get end positions
	//------------------------------------------------------------------
	this.getEnd1Position = function() { return _end1.position; }
	this.getEnd2Position = function() { return _end2.position; }

	//---------------------------------------------------
	// detect mouse hover hovered
	//---------------------------------------------------
	this.detectHover = function( touchPosition ) 
	{ 
	    if ( ( _end1.detectHover( touchPosition ) )
	    ||   ( _end2.detectHover( touchPosition ) ) )
	    { 
	        return true; 
	    }

	    return false;
	}
	
    
	//-----------------------------
	// get hovered
	//-----------------------------
	this.getHovered = function() 
	{ 
	    if (( _end1.hovered )
	    ||  ( _end2.hovered ))
	    {
	        //console.log( "OK" );
	        return true;
	    }
	    
	    return false;
	}
	 
	//----------------------------
	// get being moved
	//---------------------------
	this.getBeingMoved = function() 
	{ 
	    return _end1.moved || _end2.moved; 
	}

	 
	//--------------------------------------------
	// calculate stuff when moving an endpoint...
	//-------------------------------------------
	function calculateStuff() 
	{ 
	    //--------------------------------------------
	    // calcualte axis
	    //--------------------------------------------
	    _axis.x = _end2.position.x - _end1.position.x;
	    _axis.y = _end2.position.y - _end1.position.y;
	    
	    //--------------------------------------------
	    // calculate midpoint
	    //--------------------------------------------
	    _mid.x  = _end1.position.x + _axis.x * ONE_HALF;
	    _mid.y  = _end1.position.y + _axis.y * ONE_HALF;
	    
	    //------------------------------------------------------------
	    // calculate length
	    //------------------------------------------------------------
	    _length = Math.sqrt( _axis.x * _axis.x + _axis.y * _axis.y );

	    //----------------------------------
	    // calculate direction
	    //----------------------------------
        _direction.x = _axis.x / _length;
        _direction.y = _axis.y / _length;
        
	    //---------------------------
	    // calculate perpendicular
	    //---------------------------
        _perp.x =  _direction.y;
        _perp.y = -_direction.x;
        
        //--------------------------------------------
        // handle endpoints bumping into each other
        //--------------------------------------------
        let minLength = END_RADIUS * 2;
         
	    if ( _length < minLength )
	    {   
	        let penetration = ONE - ( _length / minLength );
	        	        
	        let xShift = END_RADIUS * _direction.x * penetration;
	        let yShift = END_RADIUS * _direction.y * penetration;
	        
	        _end1.position.x -= xShift;
	        _end1.position.y -= yShift; 

	        _end2.position.x += xShift;
	        _end2.position.y += yShift;
	    }
	    
	    
        //---------------------------------------
        // handle collisions with the pool walls
        //---------------------------------------
        let left   = POOL_LEFT   + END_RADIUS;
        let right  = POOL_RIGHT  - END_RADIUS
        let bottom = POOL_BOTTOM - END_RADIUS
        let top    = POOL_TOP    + END_RADIUS
        
             if ( _end1.position.x > right  ) { _end1.position.x = right;  }
        else if ( _end1.position.x < left   ) { _end1.position.x = left;   }
             if ( _end1.position.y > bottom ) { _end1.position.y = bottom; }
        else if ( _end1.position.y < top    ) { _end1.position.y = top;    }

             if ( _end2.position.x > right  ) { _end2.position.x = right;  }
        else if ( _end2.position.x < left   ) { _end2.position.x = left;   }
             if ( _end2.position.y > bottom ) { _end2.position.y = bottom; }
        else if ( _end2.position.y < top    ) { _end2.position.y = top;    }
	}
    
	//--------------------------------
	// render
	//--------------------------------
	this.render = function( camera )
	{
        //--------------------------------------------
        // show main shaft
        //--------------------------------------------
        canvas.strokeStyle = "rgb( 200, 200, 200 )";	    
        canvas.lineWidth = END_RADIUS;
        canvas.beginPath();
        canvas.moveTo( _end1.position.x, _end1.position.y );
        canvas.lineTo( _end2.position.x, _end2.position.y );
        canvas.closePath();
        canvas.stroke();

        /*
        //--------------------------------------------
        // show perpendicular
        //--------------------------------------------
        canvas.strokeStyle = "rgb( 255, 255, 100 )";	    
        canvas.lineWidth = 2;
        canvas.beginPath();
        canvas.moveTo( _mid.x,  _mid.y  );
        canvas.lineTo( _mid.x + _perp.x * 100, _mid.y + _perp.y * 100 );
        canvas.closePath();
        canvas.stroke();
        
        //--------------------------------------------
        // show mid point
        //--------------------------------------------
        canvas.fillStyle = "rgb( 0, 0, 0 )";	    
        canvas.beginPath();
        canvas.arc( _mid.x, _mid.y, 5, 0, PI2, false );
        canvas.fill();
        canvas.closePath();	
        */
        
        //-----------------------
        // show ends
        //-----------------------
        _end1.render( camera );
        _end2.render( camera );
    }
}








// === simulation/GenePool.js ===
//--------------------------------------------------------------------------
//                                                                        
//    This file is part of GenePool Swimbots.                             
//    Copyright (c) 2021 by Jeffrey Ventrella - All Rights Reserved.      
//                                                                        
//    See the README file or go to swimbots.com for full license details.           
//    You may use, distribute, and modify this code only under the terms  
//    of the "Commons Clause" license (commonsclause.com).                
//                                                                        
//    This software is intended for education, game design, and research. 
//                                                                        
// -------------------------------------------------------------------------- 

"use strict";

const SimulationStartMode = 
{
    RANDOM       : 0,
    FROGGIES     : 1,
    TANGO        : 2,
    RACE         : 3,
    NEIGHBORHOOD : 4,
    BIG_BANG     : 5,
    BAD_PARENTS  : 6,
    BARRIER      : 7,
    EMPTY        : 8,
    FILE         : 9,
    SPECIES      : 10
};

const CameraNavigationAction = 
{
    LEFT    : 0,
    RIGHT   : 1,
    UP      : 2,
    DOWN    : 3,
    IN      : 4,
    OUT     : 5
}



// this needs to be the same as the corresponding value in Embryology.js !!!!
const NUM_GENES_USED = 112;

//---------------------------------------------------------------
// The global tweakers are all adjustable through the UI.
//---------------------------------------------------------------
var globalTweakers = new GlobalTweakers();

//------------------
function GenePool() 
{	
	//-----------------------------------
	// count-related constants
	//-----------------------------------
//const MAX_FOODBITS          = 2000;
//const INITIAL_NUM_SWIMBOTS  = 200;
//const INITIAL_NUM_FOODBITS  = 800;    
    const TRAIL_LENGTH = 100;
    
    const NUM_NEIGHBORHOOD_SWIMBOTS = 14 * 14;
    const NUM_NEIGHBORHOOD_FOODBITS = 28 * 28;
    
	//---------------------------------------------
	// rendering-related constants
	//---------------------------------------------
    const DEFAULT_MILLISECONDS_PER_UPDATE = 20;

//const LEVEL_OF_DETAIL_THRESHOLD         = 1000.0;
    const LEVEL_OF_DETAIL_THRESHOLD         = 1200.0;

    const INITIAL_VIEW_SCALE                = POOL_WIDTH * 0.1;
    const RACE_VIEW_SCALE                   = POOL_WIDTH * 0.3;
    const BANG_VIEW_SCALE                   = POOL_WIDTH * 0.2;
    const PARENT_VIEW_SCALE                 = POOL_WIDTH * 0.05;
    const NEIGHBORHOOD_VIEW_SCALE           = POOL_WIDTH * 0.4;
    const NEIGHBORHOOD_FREQ                 = 5.0;
    const DEBUG_SHOW_SWIMBOT_TRAIL          = false;
    //const SWIMBOT_DATA_UPDATE_PERIOD        = 30;
    const CAMERA_TRACKING_UPDATE_PERIOD     = 10;
    const CLONE_SEPARATION                  = 10.0;
    const FOOD_RACE_SIZE                    = 1000;
    const FOOD_BANG_SIZE                    = 1700;
    
	//----------------------------------------------------
	// variables
	//----------------------------------------------------
	let _millisecondsPerUpdate  = 0;
	let _touch                  = new Touch(); 
	let _swimbots 		        = new Array( Swimbot ); 
	let _foodBits		        = new Array( MAX_FOODBITS );
    let _nearbySwimbotsArray    = new Array( BRAIN_MAX_PERCEIVED_NEARBY_SWIMBOTS );
	let _viewTracking		    = new ViewTracking();
    let _potentialMate          = new Swimbot();
	let _chosenFoodBit          = new FoodBit();
	let _camera  		        = new Camera();
	let _obstacle               = new Obstacle();
	let _pool			        = new Pool();
	let _embryology		        = new Embryology();
	let _vectorUtility          = new Vector2D();
	let _myGenotype             = new Genotype();
    let _mateGenotype           = new Genotype();
    let _childGenotype          = new Genotype();
    let _neighborhoodX          = new Array();
    let _neighborhoodY          = new Array();
    let _neighborhoodAxis       = new Array();
	let _simulationRunning      = false;
	let _rendering              = false;
	let _swimbotBeingDragged    = false;
	let _foodBitBeingDragged    = false;
	let _poolCenter             = new Vector2D();   
	let _canvas                 = null;  
	let _clock                  = 0;
	let _numSwimbots 	        = 0;
    let _numNearbySwimbots      = 0;
	let _numFoodBits 	        = 0;
	let _canvasWidth            = 0;
	let _canvasHeight           = 0;
	let _mousedOverSwimbot      = NULL_INDEX;
    let _mousedOverFoodBit      = NULL_INDEX;
	let _selectedSwimbot        = NULL_INDEX;
	let _selectedFoodBit        = NULL_INDEX;
	let _startTime		        = ZERO;
	let _seconds		        = ZERO;
    let _gardenOfEdenRadius     = ZERO;
	let _levelOfDetail	        = SWIMBOT_LEVEL_OF_DETAIL_LOW;
	let _previousTime           = ZERO;
	let _frameRate              = ZERO;
	let _debugTrail 		    = new Array( TRAIL_LENGTH ); 
	let _familyTree             = new FamilyTree();
	let _phyloTree              = new PhyloTree();
	let _panningLeft            = false;
	let _panningRight           = false;
	let _panningUp              = false;
	let _panningDown            = false;
    let _zoomingIn              = false;
    let _zoomingOut             = false;
    let _renderingGoals         = false;
    let _windowWidth            = 0;
    let _windowHeight           = 0;
    

	//-------------------------------------
	// create fixed-sized swimbot array
	//-------------------------------------
	for (let s=0; s<MAX_SWIMBOTS; s++)
	{
		_swimbots[s] = new Swimbot(); 
		_swimbots[s].setParent(this);
	}	
    
	//---------------------------------------------------------
	// create fixed-sized perceived nearby swimbot array
	//---------------------------------------------------------
	for (let s=0; s<BRAIN_MAX_PERCEIVED_NEARBY_SWIMBOTS; s++)
	{
		_nearbySwimbotsArray[s] = new Swimbot(); 
	}	
    
	//-------------------------------------
	// create fixed-sized foodbit array
	//-------------------------------------
	for (let f=0; f<MAX_FOODBITS; f++)
	{
		_foodBits[f] = new FoodBit(); 
	}	
    
	//-------------------------------------
	// create trail array
	//-------------------------------------
	for (let t=0; t<TRAIL_LENGTH; t++)
	{
		_debugTrail[t] = new Vector2D(); 
	}	
	
	//-------------------------------
	// This is an important call!
	//-------------------------------
	this.setCanvas = function(c)
    {
        _canvas = c;        
        //console.log( canvas );
    }
    
	//-------------------------------------------
	this.setCanvasDimensions = function( w, h )
    {
        //console.log( "setCanvasDimensions: " + w + ", " + h );
        
        _canvasWidth  = w;
        _canvasHeight = h;

        _camera.setAspectRatio( _canvasWidth / _canvasHeight );
    }
    
    
	//---------------------------
	this.initialize = function()
	{	
		//----------------------------------
		// get pool center
		//----------------------------------
        _poolCenter.copyFrom( _pool.getCenter() );
        
		//------------------------------------
		// start with a random simulation
		//------------------------------------
        this.startSimulation( SimulationStartMode.RANDOM );
        
        _millisecondsPerUpdate = DEFAULT_MILLISECONDS_PER_UPDATE;
        
		//------------------------------------------
		// configure view tracking
		//------------------------------------------
//_viewTracking.setPoolCenter( _poolCenter );	        
        _viewTracking.setSwimbots( _swimbots );	   
        _viewTracking.setMode( ViewTrackingMode.AUTOTRACK, _camera.getPosition(), _camera.getScale(), 0 );   
        
		//------------------------------------------------------------
		// start up the timer
		//------------------------------------------------------------
		this.timer = setTimeout(() => genePool.update(), _millisecondsPerUpdate);	
	}
	
	
	//------------------------------------------
	this.startSimulation = function( mode )
	{	
//looks like numOffspring didn't get reset. fix this! (and any other related side effects
	
		//----------------------------
		// start time
		//----------------------------
		_startTime = (new Date).getTime();

		//----------------------------------
		// initialize pool
		//----------------------------------
		_seconds = ( (new Date).getTime() - _startTime ) / MILLISECONDS_PER_SECOND;
	    _pool.initialize( _seconds );

        //-------------------------
        // initialize camera
        //-------------------------
        _camera.setScale( INITIAL_VIEW_SCALE );
        _camera.setPosition( _poolCenter );
        
        //-------------------------
        // reset view control
        //-------------------------
        _viewTracking.reset();

        //-------------------------
        // reset family tree
        //-------------------------
        _familyTree.reset();
        
        //--------------------------------------
        // clear out all swimbots and food bits
        //--------------------------------------
        _numSwimbots = 0;
        for (let s=0; s<MAX_SWIMBOTS; s++)
        {
            _swimbots[s].clear();
        }                    

        _numFoodBits = 0            
        for (let f=0; f<MAX_FOODBITS; f++)
        {
            _foodBits[f].kill();
        }            
        
        //-------------------------------------------------------------------
        // Here I set ecosystem tweak values to their defaults. Some of 
        // them may be changed afterwards depending on the simulation mode.
        //-------------------------------------------------------------------
        this.setFoodGrowthDelay     ( DEFAULT_FOOD_REGENERATION_PERIOD  );
        this.setFoodSpread          ( DEFAULT_FOOD_BIT_MAX_SPAWN_RADIUS );
        this.setFoodBitEnergy       ( DEFAULT_FOOD_BIT_ENERGY           );
        this.setHungerThreshold     ( DEFAULT_SWIMBOT_HUNGER_THRESHOLD  );
        this.setAttraction          ( ATTRACTION_SIMILAR_COLOR          );
        this.setGardenOfEdenRadius  ( DEFAULT_GARDEN_OF_EDEN_RADIUS     );
        this.setOffspringEnergyRatio( DEFAULT_CHILD_ENERGY_RATIO        );
        this.setMaximumSwimbotAge   ( DEFAULT_MAXIMUM_AGE               );
        
        // do this stuff after doing the stuff above:
        _numSwimbots = INITIAL_NUM_SWIMBOTS;
        _numFoodBits = INITIAL_NUM_FOODBITS;

        //-----------------------------------
        // default
        //-----------------------------------
        globalTweakers.numFoodTypes = 1;
        this.randomizeFood();
        
        //console.log( "startSimulation: setOffspringEnergyRatio to default: " + DEFAULT_CHILD_ENERGY_RATIO );
        
        //---------------------------------------------------------------------
        // initialize various parameters according to simulation start mode
        //---------------------------------------------------------------------
        if ( mode === SimulationStartMode.RANDOM )
        {
            //this uses all default values
        }
        else if ( mode === SimulationStartMode.SPECIES )
        {
            globalTweakers.numFoodTypes = 2;
            this.randomizeFood(); // Important: do this after setting numFoodTypes!

//this.setGardenOfEdenRadius( 1500 ); /* again... */ this.randomizeFood();
this.setFoodGrowthDelay( 15 );  
//this.setMaximumSwimbotAge( 15000 );
this.setMaximumSwimbotAge( 20000 );
_numSwimbots = 1000;
_numFoodBits = 2000;
this.setFoodToSpeciesConfiguration();
_camera.setScale( POOL_WIDTH );
        }
        else if ( mode === SimulationStartMode.FROGGIES )
        {
            //this.randomizeFood();
        }
        else if ( mode === SimulationStartMode.TANGO )
        {
            _numSwimbots = 2;
            //this.randomizeFood();
        }
        else if ( mode === SimulationStartMode.RACE )
        {
            _numSwimbots = 4;
            this.setFoodToRaceConfiguration();
            _camera.setScale( RACE_VIEW_SCALE );
        }
        else if ( mode === SimulationStartMode.BIG_BANG )
        {        
            _numSwimbots = 100;
            this.setFoodToBangConfiguration();
            _camera.setScale( BANG_VIEW_SCALE );
        }
        else if ( mode === SimulationStartMode.BAD_PARENTS )
        {        
            _numSwimbots = 2;
            this.setFoodToBadParentsConfiguration();
            
            this.setFoodGrowthDelay     ( 200 );  
            this.setFoodSpread          ( 20 );       
	        this.setHungerThreshold     ( 150 );
            this.setFoodBitEnergy       ( 6 );
            this.setOffspringEnergyRatio( 0.0001 );
	        
            //console.log( "if ( mode === SimulationStartMode.BAD_PARENTS ): setOffspringEnergyRatio to 0.001" );
            
            _camera.setScale( PARENT_VIEW_SCALE );
        }
        else if ( mode === SimulationStartMode.BARRIER )
        {        
            // the obstacle is initialized below to be in the middle of the pool!
            
            //this.setFoodToBarrierConfiguration();
            //this.randomizeFood();
            
            //_camera.setScale( PARENT_VIEW_SCALE );
        }
        else if ( mode === SimulationStartMode.NEIGHBORHOOD )
        {
            _camera.setScale( NEIGHBORHOOD_VIEW_SCALE );
            _numSwimbots = NUM_NEIGHBORHOOD_SWIMBOTS;
            this.randomizeNeighborhood();
            this.setFoodToNeighborhood( _poolCenter, _gardenOfEdenRadius );
        }
        else if ( mode === SimulationStartMode.EMPTY )
        {
            _numSwimbots = 0;
            //this.randomizeFood();
        }

        //----------------------------------
        // initialize swimbots
        //----------------------------------
        for (let i=0; i<_numSwimbots; i++)
        {
            let initialPosition = new Vector2D();

            initialPosition.setToRandomLocationInDisk( _poolCenter, _gardenOfEdenRadius ); 


if ( mode === SimulationStartMode.SPECIES )
{
    let s = POOL_WIDTH * 0.4;

    let x = Math.random() * s;
    let y = POOL_HEIGHT * ONE_HALF - s * ONE_HALF + + Math.random() * s;
    
    if ( Math.random() < ONE_HALF )
    {
        x = POOL_WIDTH - x;
    }
    
    initialPosition.setXY( x, y )
}


            //-----------------------------------------
            // yo, initial age is distributed
            //-----------------------------------------
            let weightedRandomNormal = Math.random();
            
            //I'm running various tests - to understand why there's a sharp die-off when maximumLifeSpan is 15000. 
            //let weightedRandomNormal = Math.random() * Math.random();
            //let weightedRandomNormal = Math.random() * Math.random() * Math.random();
            //let weightedRandomNormal = Math.sqrt( Math.random() );
            
            
            let initialAge = YOUNG_AGE_DURATION + Math.floor( ( globalTweakers.maximumLifeSpan - YOUNG_AGE_DURATION ) * weightedRandomNormal );
                                    
            assert( ( initialAge >= YOUNG_AGE_DURATION ), "Genepool.js: startSimulation: ( initialAge >= YOUNG_AGE_DURATION )" );                        
            assert( ( initialAge <= globalTweakers.maximumLifeSpan ), "Genepool.js: startSimulation: ( initialAge <= globalTweakers.maximumLifeSpan )" );                        
            
            let initialAngle    = getRandomAngleInDegrees(); //-180.0 + Math.random() * 360.0;
            let initialEnergy   = DEFAULT_SWIMBOT_HUNGER_THRESHOLD;

            //--------------------------------------------------
            // set values according to sim type
            //--------------------------------------------------

            //---------------------------------
            // neighborhood
            //---------------------------------
            if ( mode === SimulationStartMode.NEIGHBORHOOD )
            {
                let sqrt = Math.floor( Math.sqrt( _numSwimbots ) );
                let xMod = i % sqrt;
                let yMod = Math.floor( ( i / _numSwimbots ) * sqrt );
                
                let xFraction = xMod / sqrt;
                let yFraction = yMod / sqrt;
                
                let x = _poolCenter.x - _gardenOfEdenRadius + xFraction * _gardenOfEdenRadius * 2; 
                let y = _poolCenter.y - _gardenOfEdenRadius + yFraction * _gardenOfEdenRadius * 2; 
                 
                initialPosition.setXY( x, y ); 
                                       
                for (let g=0; g<NUM_GENES; g++)
                {
                    let value = ZERO; 
                    
                    if ( _neighborhoodAxis[g] )
                    {
                        value = ONE_HALF + ONE_HALF * Math.sin( ( _neighborhoodX[g] + ( - ONE_HALF + xFraction ) ) * NEIGHBORHOOD_FREQ  ); 
                    }
                    else
                    {
                        value = ONE_HALF + ONE_HALF * Math.sin( ( _neighborhoodY[g] + ( - ONE_HALF + yFraction ) ) * NEIGHBORHOOD_FREQ  ); 
                    }
                       
                    if ( value < ZERO ) { value = ZERO; }
                    if ( value > ONE  ) { value = ONE;  }
                    
                    let geneValue = Math.floor( ( BYTE_SIZE - 1 ) * value );
 
                    _myGenotype.setGeneValue( g, geneValue );
                }
            }
            //---------------------------------
            // froggies
            //---------------------------------
            else if ( mode === SimulationStartMode.FROGGIES )
            {
                _myGenotype.setToFroggy();      
            }
            //---------------------------------
            // tango
            //---------------------------------
            else if ( mode === SimulationStartMode.TANGO )
            {
                if ( i === 0 ) { _myGenotype.setToPreset( PRESET_GENOTYPE_DARWIN ); }
                if ( i === 1 ) { _myGenotype.setToPreset( PRESET_GENOTYPE_MENDEL ); }
                                                
                if ( i === 0 ) { initialPosition.setXY( _poolCenter.x - 100 * ONE_HALF, _poolCenter.y ); }
                if ( i === 1 ) { initialPosition.setXY( _poolCenter.x + 100 * ONE_HALF, _poolCenter.y ); }
            }
            //---------------------------------
            // race
            //---------------------------------
            else if ( mode === SimulationStartMode.RACE )
            {            
                /*
                if ( i === 0 ) { _myGenotype.setToPreset( PRESET_GENOTYPE_MARGULIS   ); }
                if ( i === 1 ) { _myGenotype.setToPreset( PRESET_GENOTYPE_MARGULIS   ); }
                if ( i === 2 ) { _myGenotype.setToPreset( PRESET_GENOTYPE_DAWKINS  ); }
                if ( i === 3 ) { _myGenotype.setToPreset( PRESET_GENOTYPE_DAWKINS  ); }
                */

                if ( i === 0 ) { _myGenotype.setToPreset( PRESET_GENOTYPE_WILSON   ); }
                if ( i === 1 ) { _myGenotype.setToPreset( PRESET_GENOTYPE_WILSON   ); }
                if ( i === 2 ) { _myGenotype.setToPreset( PRESET_GENOTYPE_DENNETT  ); }
                if ( i === 3 ) { _myGenotype.setToPreset( PRESET_GENOTYPE_DENNETT  ); }

                if ( i === 0 ) { initialPosition.setXY( _poolCenter.x - FOOD_RACE_SIZE, _poolCenter.y + FOOD_RACE_SIZE      ); }
                if ( i === 1 ) { initialPosition.setXY( _poolCenter.x - FOOD_RACE_SIZE, _poolCenter.y + FOOD_RACE_SIZE - 60 ); }
                if ( i === 2 ) { initialPosition.setXY( _poolCenter.x + FOOD_RACE_SIZE, _poolCenter.y + FOOD_RACE_SIZE      ); }
                if ( i === 3 ) { initialPosition.setXY( _poolCenter.x + FOOD_RACE_SIZE, _poolCenter.y + FOOD_RACE_SIZE - 60 ); }
            }
            //-------------------------------------------------
            // big bang
            //-------------------------------------------------
            else if ( mode === SimulationStartMode.BIG_BANG )
            {            
                initialPosition.setXY( _poolCenter.x, _poolCenter.y );                
                _myGenotype.randomize();
            }
            //-------------------------------------------------
            // bad parents
            //-------------------------------------------------
            else if ( mode === SimulationStartMode.BAD_PARENTS )
            {            
                if ( i === 0 ) { _myGenotype.setToPreset( PRESET_GENOTYPE_TURING ); }
                if ( i === 1 ) { _myGenotype.setToPreset( PRESET_GENOTYPE_TURING ); }

                if ( i === 0 ) { initialPosition.setXY( _poolCenter.x - 200 * ONE_HALF, _poolCenter.y ); }
                if ( i === 1 ) { initialPosition.setXY( _poolCenter.x + 200 * ONE_HALF, _poolCenter.y ); }
            }
            
            /*
            //-------------------------------------------------
            // barrier
            //-------------------------------------------------
            else if ( mode === SimulationStartMode.BARRIER )
            {            
                if ( i === 0 ) { _myGenotype.setToPreset( PRESET_GENOTYPE_DAWKINS   ); }
                if ( i === 1 ) { _myGenotype.setToPreset( PRESET_GENOTYPE_WALLACE   ); }
                if ( i === 2 ) { _myGenotype.setToPreset( PRESET_GENOTYPE_MENDEL    ); }
                if ( i === 3 ) { _myGenotype.setToPreset( PRESET_GENOTYPE_WILSON    ); }
                if ( i === 4 ) { _myGenotype.setToPreset( PRESET_GENOTYPE_TURING    ); }
                if ( i === 5 ) { _myGenotype.setToPreset( PRESET_GENOTYPE_MARGULIS  ); }
                
                let s = 150;

                if ( i === 0 ) { initialPosition.setXY( _poolCenter.x + s * -1,  _poolCenter.y + s * -1 ); }
                if ( i === 1 ) { initialPosition.setXY( _poolCenter.x + s *  0,  _poolCenter.y + s * -1 ); }
                if ( i === 2 ) { initialPosition.setXY( _poolCenter.x + s *  1,  _poolCenter.y + s * -1 ); }
                if ( i === 3 ) { initialPosition.setXY( _poolCenter.x + s * -1,  _poolCenter.y + s *  1 ); }
                if ( i === 4 ) { initialPosition.setXY( _poolCenter.x + s *  0,  _poolCenter.y + s *  1 ); }
                if ( i === 5 ) { initialPosition.setXY( _poolCenter.x + s *  1,  _poolCenter.y + s *  1 ); }
            }
            */
            //---------------------------------
            // normal
            //---------------------------------
            else
            {
                _myGenotype.randomize();
            }

            //--------------------------------------------------
            // This sets all junk DNA to a value of 0!!!
            //--------------------------------------------------
            for (let g=NUM_GENES_USED; g<NUM_GENES; g++)
            {
                _myGenotype.setGeneValue( g, 0 );
            }            

            //-------------------------------------------------------------------------------
            // This is not the most elegant way to do this, but just to get it working.....
            // For any simulation mode (pool preset) other than Species, the swimbot genes 
            // for food type preferrence and food type digestion are set to 0 (green).
            //-------------------------------------------------------------------------------
            if ( mode != SimulationStartMode.SPECIES )
            {
                //-------------------------------------------------------------------------------------------------
                // This sets the food type gene to be the same as the preferredFoodColor gene
                //-------------------------------------------------------------------------------------------------
                //let foodColorGene = _embryology.getFoodColorGene();
                //let foodTypeGene  = _embryology.getFoodNutritionGene();  
                          
                //console.log( "foodColorGene     = " + foodColorGene     );
                //console.log( "foodNutritionGene = " + foodNutritionGene );
                //let geneValue = _myGenotype.getGeneValue( foodColorGene );
                //console.log( "geneValue = " + geneValue );
                //_myGenotype.setGeneValue( foodNutritionGene, 0 );                
                //_myGenotype.setGeneValue( foodNutritionGene, 0 );                
            }
            
            //--------------------------------------------------
            // create the swimbot
            //--------------------------------------------------
            _swimbots[i].create( i, initialAge, initialPosition, initialAngle, initialEnergy, _myGenotype, _embryology );	
            
            //------------------------------------------------------------------------------------
            // add the new swimbot to the family tree
            //------------------------------------------------------------------------------------
            _familyTree.addNode( i, NULL_INDEX, NULL_INDEX, _clock, this.getSwimbotGenes(i) );
        }	
        
        //--------------------------------------
        // initilize obstacle       
        //--------------------------------------  
		let end1 = new Vector2D();
		let end2 = new Vector2D();
		
		end1.setXY( POOL_LEFT + POOL_WIDTH * 0.005, POOL_TOP + POOL_HEIGHT * 0.005 );
		end2.setXY( POOL_LEFT + POOL_WIDTH * 0.01,  POOL_TOP + POOL_HEIGHT * 0.005 );

        if ( mode === SimulationStartMode.BARRIER )
        {
    		end1.setXY( POOL_LEFT + POOL_WIDTH * 0.2, POOL_TOP + POOL_HEIGHT * ONE_HALF );
	    	end2.setXY( POOL_LEFT + POOL_WIDTH * 0.8, POOL_TOP + POOL_HEIGHT * ONE_HALF );
        }


        /*
        if ( mode === SimulationStartMode.RANDOM )
        {
    		end1.setXY( POOL_LEFT + POOL_WIDTH * 0.5, POOL_TOP + POOL_HEIGHT * 0.5 );
	    	end2.setXY( POOL_LEFT + POOL_WIDTH * 0.5, POOL_TOP + POOL_HEIGHT * 0.8 );
        }
        */
        
		_obstacle.setEndpointPositions( end1, end2 );
        
        for (let m=0; m<10; m++)
        {
            moveFoodBitsFromObstacle();
        }
        
		//---------------------------------
		// clear this!
		//---------------------------------
        setSelectedSwimbot( NULL_INDEX );
        
		//---------------------------------
		// set _simulationRunning to true
		//---------------------------------
		_simulationRunning = true;
		
		//---------------------------------
		// set rendering to true
		//---------------------------------
		_rendering = true;
    
		//---------------------------------
		// reset clock to 0
		//---------------------------------
		_clock = 0;
	}
	
	

	//----------------------------------------
	this.setGardenOfEdenRadius = function(r)
	{
	    _gardenOfEdenRadius = r;
	}
		
	//-------------------------------------
	this.randomizeNeighborhood = function()
	{
        for (let g=0; g<NUM_GENES; g++)
        {
            _neighborhoodX[g] = -ONE + Math.random() * 2.0;
            _neighborhoodY[g] = -ONE + Math.random() * 2.0;
            
            if ( Math.random() < ONE_HALF )
            {
                _neighborhoodAxis[g] = false;
            }		    		
            else
            {
                _neighborhoodAxis[g] = true;
            }
	    }
	}
	
	//------------------------------
	this.randomizeFood = function()
	{	
        for (let f=0; f<_numFoodBits; f++)
        {
            _foodBits[f].initialize(f);
            
            //-------------------------------------------------------------------
            // set food type...
            //-------------------------------------------------------------------
            let n = 0;
                      
            if ( globalTweakers.numFoodTypes === 2 )
            { 
                n = Math.floor( Math.random() * 2 ); 

                /*
                //first half is one type, the other half is the other type...
                if ( f < _numFoodBits * ONE_HALF  ) 
                {
                    n = 0;
                }
                else
                {
                    n = 1;
                } 
                */
            }
            
            _foodBits[f].setType(n);

            //-------------------------------------------------------------------
            // place food bit randomly in a disk in the middle of the pool
            //-------------------------------------------------------------------
            let poolCenter = new Vector2D();
            poolCenter.x = POOL_LEFT + POOL_WIDTH  * ONE_HALF; 
            poolCenter.y = POOL_TOP  + POOL_HEIGHT * ONE_HALF; 
            
            let foodBitPosition = new Vector2D();        
            foodBitPosition.setToRandomLocationInDisk( poolCenter, _gardenOfEdenRadius ); 
            
/*
if ( mode === SimulationStartMode.SPECIES )
{
    lfoodBitPosition.x = Math.random() * POOL_WIDTH * 0.24;
    foodBitPosition.y = Math.random() * POOL_HEIGHT;
    
    if ( Math.random() < ONE_HALF )
    {
        foodBitPosition.x = POOL_WIDTH - foodBitPosition.x;
    }
}
            */
            
            _foodBits[f].setPosition( foodBitPosition );
        }
	}
	
	
	//----------------------------------------------------------
	this.setFoodToNeighborhood = function( position, size )
	{		
        _numFoodBits = NUM_NEIGHBORHOOD_FOODBITS;
    
        for (let f=0; f<_numFoodBits; f++)
        {
            let sqrt = Math.floor( Math.sqrt( _numFoodBits ) );
            let xMod = f % sqrt;
            let yMod = Math.floor( ( f / _numFoodBits ) * sqrt );
            
            let xFraction = xMod / sqrt;
            let yFraction = yMod / sqrt;
            
            let foodBitPosition = new Vector2D();
            
            foodBitPosition.setXY
            (
                position.x - size + xFraction * size * 2,
                position.y - size + yFraction * size * 2
            ); 

            _foodBits[f].initialize(f);
            _foodBits[f].setPosition( foodBitPosition );
        }
	}
	
	

	//--------------------------------------------------
	this.setFoodToBarrierConfiguration = function()
	{	
        _numFoodBits = 40;
        let spread = 500;
        let p = new Vector2D();
        
        for (let f=0; f<_numFoodBits; f++)
        {
            _foodBits[f].initialize(f);
            p.setXY
            ( 
                _poolCenter.x + ( -spread * ONE_HALF + Math.random() * spread ), 
                _poolCenter.y + ( -spread * ONE_HALF + Math.random() * spread ) 
            );
             
            _foodBits[f].setPosition(p); 
        }

        this.setFoodSpread( MIN_FOOD_BIT_MAX_SPAWN_RADIUS + ( MAX_FOOD_BIT_MAX_SPAWN_RADIUS - MIN_FOOD_BIT_MAX_SPAWN_RADIUS ) * 0.2 );
	}
	


	//-------------------------------------------
	this.setFoodToBadParentsConfiguration = function()
	{	
        _numFoodBits = 5;

        let spread = 100;
        let p = new Vector2D();
        let f = -1;
    
        f++; _foodBits[f].initialize(f); p.setXY( _poolCenter.x, _poolCenter.y + spread * -1.0 ); _foodBits[f].setPosition(p); 
        f++; _foodBits[f].initialize(f); p.setXY( _poolCenter.x, _poolCenter.y + spread * -0.5 ); _foodBits[f].setPosition(p);
        f++; _foodBits[f].initialize(f); p.setXY( _poolCenter.x, _poolCenter.y + spread *  0.0 ); _foodBits[f].setPosition(p);
        f++; _foodBits[f].initialize(f); p.setXY( _poolCenter.x, _poolCenter.y + spread *  0.5 ); _foodBits[f].setPosition(p);
        f++; _foodBits[f].initialize(f); p.setXY( _poolCenter.x, _poolCenter.y + spread *  1.0 ); _foodBits[f].setPosition(p);

        
        /*
        let range = 100;
        let spread = 40.0;
    
        for (let f=0; f<_numFoodBits; f++)
        {
            let side = -range;
            
            if ( Math.random() > ONE_HALF ) { side = range; }
            let x = _poolCenter.x + side + Math.random() * spread;
            let y = _poolCenter.y + Math.random() * spread;
            foodBitPosition.setXY( x, y ); 
        
            _foodBits[f].initialize(f);
            _foodBits[f].setPosition( foodBitPosition );    
    	}
    	*/
    	
    	
        this.setFoodSpread( MIN_FOOD_BIT_MAX_SPAWN_RADIUS );
	}
	
	
	//-------------------------------------------
	this.setFoodToBangConfiguration = function()
	{	
        _numFoodBits = 500;
        let radius   = ONE;
        let fraction = ZERO;
        let thirdNum = _numFoodBits / 3.0;
        
        let foodBitPosition = new Vector2D();
    
        for (let f=0; f<_numFoodBits; f++)
        {            
            if ( f > _numFoodBits * 0.66666 )
            {
                fraction = ( f - ( _numFoodBits * 0.66666 ) ) / thirdNum;            
                radius = 600;
            }
            else if ( f > _numFoodBits * 0.333333 )
            {
                fraction = ( f - ( _numFoodBits * 0.333333 ) ) / thirdNum;            
                radius = 900;
            }
            else
            {
                fraction = f / thirdNum;
                radius = 300;
            }

            let radian = fraction * Math.PI * 2.0;
            
            
            // spiral
            /*
            radius *= 1.016;          
            let radian = f * 0.2;
            */
            
            
            let x = _poolCenter.x + radius * Math.sin( radian );
            let y = _poolCenter.y + radius * Math.cos( radian );
            
            foodBitPosition.setXY( x, y ); 

            _foodBits[f].initialize(f);
            _foodBits[f].setPosition( foodBitPosition );    
        }	
        
        this.setFoodGrowthDelay( DEFAULT_FOOD_REGENERATION_PERIOD );
        this.setFoodSpread( 20 );
	}
	

	//-------------------------------------------
	this.setFoodToSpeciesConfiguration = function()
	{	
    	let p = new Vector2D();

        for (let f=0; f<_numFoodBits; f++)
        {            
            let s = POOL_WIDTH * 0.4;
            p.x = Math.random() * s;
            p.y = POOL_HEIGHT * ONE_HALF - s * ONE_HALF + + Math.random() * s;

            _foodBits[f].setType( Math.floor( Math.random() * 2 ) );
    
            if ( Math.random() < ONE_HALF )
            {
                p.x = POOL_WIDTH - p.x;
            }
            
            _foodBits[f].setPosition(p); 
    	}
	}
	
	//-------------------------------------------
	this.setFoodToRaceConfiguration = function()
	{	
       	_numFoodBits = 0;
       	
    	let p = new Vector2D();
    	let num = 200;
    	let xx = _poolCenter.x;
    	let yy = _poolCenter.y + FOOD_RACE_SIZE * 0.9;
    	
    	for (let f=0; f<num; f++)
    	{
            let fraction = f / num;

            p.x = xx + FOOD_RACE_SIZE * Math.cos( fraction * Math.PI ); 
            p.y = yy - FOOD_RACE_SIZE * Math.sin( fraction * Math.PI ); 

            _foodBits[ _numFoodBits ].initialize(f); 
            _foodBits[ _numFoodBits ].setPosition(p); 
            _numFoodBits ++;    	    
        }	

        num = 140;
        let r = 0;
    	xx = _poolCenter.x;
    	yy = _poolCenter.y - FOOD_RACE_SIZE * 0.4;

    	for (let f=0; f<num; f++)
    	{
            let ff = f * 0.1;
            
            r += 2;

            p.x = xx + r * Math.cos( ff ); 
            p.y = yy + r * Math.sin( ff ); 

            _foodBits[ _numFoodBits ].initialize(f); 
            _foodBits[ _numFoodBits ].setPosition(p); 
            _numFoodBits ++;    	    
        }	

    	//set the delay of food growth
        this.setFoodGrowthDelay( MAX_FOOD_REGENERATION_PERIOD );    	
        this.setFoodSpread( MIN_FOOD_BIT_MAX_SPAWN_RADIUS );
	}
	

	//--------------------------------
    this.setAttraction = function(a)
	{
	    //console.log( "GenePool.js: setAttraction: " + a );	
	    
	    globalTweakers.attractionCriterion = a;

        assert( globalTweakers.attractionCriterion >= 0,                 "genepool: setAttraction: globalTweakers.attractionCriterion >= 0" )
        assert( globalTweakers.attractionCriterion < NUM_ATTRACTIONS,    "genepool: setAttraction: globalTweakers.attractionCriterion < NUM_ATTRACTIONS" )

        for (let s=0; s<MAX_SWIMBOTS; s++)
        {
            _swimbots[s].setAttraction( globalTweakers.attractionCriterion );
        }	    
	}
	
	
	
	//--------------------------------------------------------------
	this.notifySwimbotDeathTime = function( deceasedSwimbotIndex )
	{
	    assert( deceasedSwimbotIndex != NULL_INDEX, "GenePool.js: this.notifySwimbotDeathTime: deceasedSwimbotIndex != NULL_INDEX" )
	    //console.log( deceasedSwimbotIndex + " just died" );
	    _familyTree.setDeathTime( deceasedSwimbotIndex, _clock );
	}
		
	//------------------------
	this.update = function()
	{	
		//-------------------------------------
		// get seconds since started...
		//-------------------------------------
		_seconds = ( (new Date).getTime() - _startTime ) / MILLISECONDS_PER_SECOND;
		
		//-------------------------------------
		// calculate frame rate...
		//-------------------------------------
        //_frameRate = _seconds - _previousTime;
		//_previousTime = _seconds;

        if ( _simulationRunning )
        {
            //--------------------
            // advance clock...
            //--------------------
            _clock ++;

            //----------------------
            // update swimbots...
            //----------------------
            this.updateSwimbots();

            //------------------
            // update food
            //------------------
            this.updateFood();
        }
                
        if ( _rendering )
        {		
            //---------------------------
            // update camera...
            //---------------------------
            _camera.update( _seconds );
            
            if ( RENDER_SWIMBOT_AS_DOT )
            {
                _levelOfDetail = SWIMBOT_LEVEL_OF_DETAIL_DOT;
            }
            else
            {
                if ( _camera.getScale() > LEVEL_OF_DETAIL_THRESHOLD ) 
                {
                    _levelOfDetail = SWIMBOT_LEVEL_OF_DETAIL_LOW;
                }
                else 
                {
                    _levelOfDetail = SWIMBOT_LEVEL_OF_DETAIL_HIGH;
                }
            }
            
            //---------------------------
            // update camera tracking...
            //---------------------------
            if ( _viewTracking.getIsTracking() )
            {
                //if ( _clock % CAMERA_TRACKING_UPDATE_PERIOD === 0 )
                {
                    _viewTracking.updateTracking( _camera.getPosition(), _camera.getScale(), _selectedSwimbot );
                
                    _camera.addForce( _viewTracking.getCameraForce(), _viewTracking.getCameraScaleForce() );
                }
            }
        
            //------------------------------
            // update camera navigation
            //------------------------------
            this.updateCameraNavigation();

            //---------------------------
            // render everything...
            //---------------------------		
            this.render();
        }

        //-------------------------------------------------------------
        // update touch state 
        // (important for generating state for touch velocity, etc.)
        // also, important to call this after updateCameraNavigation
        //-------------------------------------------------------------
        _touch.update();
        
		//---------------------------
		// trigger next update...
		//---------------------------
        this.timer = setTimeout(() => genePool.update(), _millisecondsPerUpdate);
	}



	//--------------------------------
	this.updateSwimbots = function()
	{		

//let testNumLiving = 0;	
	
        for (let s=0; s<MAX_SWIMBOTS; s++)
        {
            if ( _swimbots[s].getAlive() )
            {
            
//testNumLiving ++;
            
            
            
                _swimbots[s].update();
                
                //-----------------------------------------------------------------
                // provide aspects of the environment for the swimbot to perceive
                //-----------------------------------------------------------------
                if ( _swimbots[s].getIsLookingForSensoryInput() )
                {
                    this.giveSwimbotNearbyEnvironmentalStimuli(s);
                }

                //--------------------------------------------------------------------------------------------------------
                // check for obstacle collision....
                //--------------------------------------------------------------------------------------------------------
                if ( _obstacle.getCollision( _swimbots[s].getPosition(), _swimbots[s].getBoundingRadius() * ONE_HALF ) )
                {
                    // only call this IMMEDIATELY after calling "_obstacle.getCollision"...
                    _vectorUtility = _obstacle.getCurrentCollisionForce();
                    _vectorUtility.scale( 1.2 );
                    _swimbots[s].addForce( _vectorUtility );
                }

                //-------------------------------------
                // eating
                //-------------------------------------
                if ( _swimbots[s].getIsTryingToEat() )
                {
                    let eatenFoodBit = _swimbots[s].eatChosenFoodBit();
                }
                
                //----------------------------------------
                // giving birth to a new swimbot
                //----------------------------------------
                if ( _swimbots[s].getIsTryingToMate() )
                {
                    let newBornSwimbotIndex = this.findLowestDeadSwimbotInArray();

                    //---------------------------------------
                    // a few quick reality checks here...
                    //---------------------------------------
                    if (( newBornSwimbotIndex != NULL_INDEX )
                    &&  ( _swimbots[s].getChosenMateIndex() != NULL_INDEX ))
                    {
                        let chosenMateIndex = _swimbots[s].getChosenMateIndex();
                        //console.log( " chosenMateIndex = " + chosenMateIndex );

                        _potentialMate = _swimbots[ chosenMateIndex ];

                        assert( _potentialMate != null, "genepool: updateSwimbots: _potentialMate != null" );

                        if ( _potentialMate.getAlive() )
                        {
                            assert( _myGenotype    != null, "genepool: updateSwimbots: _myGenotype    != null" );
                            assert( _mateGenotype  != null, "genepool: updateSwimbots: _mateGenotype  != null" );

                            //------------------------------------------------------------------------------
                            // collect genes from me and my chosen mate and recombine them for the child
                            //------------------------------------------------------------------------------
                            _myGenotype = _swimbots[s].getGenotype();
                            _mateGenotype = _potentialMate.getGenotype();
                             
                            //------------------------------------------------------------------------------
                            // if the junk dna of each swimbot are similar enough...
                            //------------------------------------------------------------------------------
if ( !this.getJunkDnaSimilarity( _myGenotype, _mateGenotype ) > NON_REPRODUCING_JUNK_DNA_LIMIT )
{
}
                            if ( this.getJunkDnaSimilarity( _myGenotype, _mateGenotype ) > NON_REPRODUCING_JUNK_DNA_LIMIT )
                            {
                                //-----------------------------------
                                // recombine genes for the child 
                                //-----------------------------------
                                assert( _childGenotype != null, "_childGenotype != null" );

                                _childGenotype.setAsOffspring( _myGenotype, _mateGenotype );

                                //------------------------------------------------
                                // collect energy from parents for child energy
                                //------------------------------------------------
                                let myEnergyContribution    = _swimbots[s].contributeToOffspring();
                                let mateEnergyContribution  = _potentialMate.contributeToOffspring();
                                let energyToOffspring       = myEnergyContribution + mateEnergyContribution;     
                            
                                //console.log( "energyToOffspring = " + energyToOffspring );
                                //assert( energyToOffspring <= DEFAULT_SWIMBOT_HUNGER_THRESHOLD, "energyToOffspring <= DEFAULT_SWIMBOT_HUNGER_THRESHOLD" );                       

                                //----------------------------------------------------------------------------------------
                                // set birth position
                                //----------------------------------------------------------------------------------------
                                let diffX = _potentialMate.getGenitalPosition().x - _swimbots[s].getGenitalPosition().x;
                                let diffY = _potentialMate.getGenitalPosition().y - _swimbots[s].getGenitalPosition().y;
                            
                                _vectorUtility.x = _swimbots[s].getGenitalPosition().x + diffX * ONE_HALF;
                                _vectorUtility.y = _swimbots[s].getGenitalPosition().y + diffY * ONE_HALF;

                                //---------------------------------------------
                                // pool effect
                                //---------------------------------------------
                                _pool.endTouch( _vectorUtility, _seconds );
                                                        
                                //--------------------------------------------
                                // create the child swimbot
                                //--------------------------------------------
                                let initialAngle = getRandomAngleInDegrees();                                                        
                                _swimbots[ newBornSwimbotIndex ].create( newBornSwimbotIndex, 0, _vectorUtility, initialAngle, energyToOffspring, _childGenotype, _embryology )
 
                                //--------------------------------------------------
                                // add the new swimbot to the family tree
                                //--------------------------------------------------
                                _familyTree.addNode( newBornSwimbotIndex, s, chosenMateIndex, _clock, this.getSwimbotGenes( newBornSwimbotIndex ) );

                            }// if ( getJunkDnaDistance( _myGenotype, _mateGenotype ) > NON_REPRODUCING_JUNK_DNA_LIMIT )
                            else 
                            {
                                //console.log( "reproduction not possible because junk dna is too dissimilar!" );
                            }
                        }   //  if ( _potentialMate.getAlive() )                     
                    }      //   if (( newBornSwimbotIndex != -1 ) &&  ( swimbot[s].getChosenMateIndex() != -1 ))
                }         //    if ( swimbot[s].isTryingToMate() )
            }            //     if ( _swimbots[s].getAlive() )
            else
            {
                //-------------------------------------------------------------
                // In case the selected swimbot has just died, de-select it!
                //-------------------------------------------------------------
                if ( _selectedSwimbot === s )
                {
                    setSelectedSwimbot( NULL_INDEX );
                }                     
            }
        } // for (let s=0; s<MAX_SWIMBOTS; s++)
        
        //-------------------------------------------------
        // if showing mutual love....
        //-------------------------------------------------
        if ( _viewTracking.getMode() === ViewTrackingMode.MUTUAL )
        {
            let lover1 = _viewTracking.getLover1Index();
            let lover2 = _viewTracking.getLover2Index();
            
            if (( lover1 != NULL_INDEX )
            &&  ( lover2 != NULL_INDEX ))
            {                
                //---------------------------------------------
                // show the mouths and genitals
                //---------------------------------------------
                _swimbots[ lover1 ].setRenderingGoals( true );
                _swimbots[ lover2 ].setRenderingGoals( true );

                //-----------------------------------------------------------------------------------
                // if either of the lovers stop pursuing the other then cancel mutual view mode
                //-----------------------------------------------------------------------------------
                if (( _swimbots[ lover1 ].getChosenMateIndex() != lover2 )
                ||  ( _swimbots[ lover2 ].getChosenMateIndex() != lover1 ))
                {
                    //_viewTracking.setMode( ViewTrackingMode.NULL, 0 );
                    //this.clearViewMode();
                    _viewTracking.stopTracking();
                }
            }	
            else
            {
                _viewTracking.stopTracking();
            }
        }
        
        
        //console.log( "num living swimbots = " + testNumLiving.toString() );            

    }
    
    
    

    //--------------------------------------------------------
	this.getJunkDnaSimilarity = function( genotype1, genotype2 )
	{		
	    let diff = ZERO;
	    let num = 0;
        for (let g=NUM_GENES_USED; g<NUM_GENES; g++)
        {
            diff += Math.abs( genotype1.getGeneValue(g) - genotype2.getGeneValue(g) ) / BYTE_SIZE;
            num ++;
        }          
        
        let similarity = ONE - ( diff / num );  
        
        //console.log( similarity );
        
	    return similarity;
	}
    
    
    //-----------------------------------
	this.generatePhyloTree = function()
	{		
	    let numJunkGenes = NUM_GENES - NUM_GENES_USED;
	    _phyloTree.initialize( numJunkGenes );
	
        for (let s=0; s<MAX_SWIMBOTS; s++)
        {
            if ( _swimbots[s].getAlive() )
            {
        	    _phyloTree.addJunkDNA( _swimbots[s].getGenotype() );	
	        }
        }
    }
    
    
    //---------------------------------------------
	this.findLowestDeadSwimbotInArray = function()
	{		
        let s = NULL_INDEX;
        let t = NULL_INDEX;

        let looking = true;
        while ( looking )
        {
            t++;

            if ( ! _swimbots[t].getAlive() )
            {
                s = t;
                assert( s < MAX_SWIMBOTS, "s < MAX_SWIMBOTS" );
                looking = false;
            }

            if ( t >= MAX_SWIMBOTS - 1 )
            {
                looking = false;
            }
        }

        return s;
    }


    //--------------------------------------------------------
	this.giveSwimbotNearbyEnvironmentalStimuli = function(s)
	{		
	    //------------------------------------------------------
	    // collect the array of nearby visible swimbots...
	    //------------------------------------------------------
        _numNearbySwimbots = 0;
        for (let o=0; o<MAX_SWIMBOTS; o++)
        {
            if (( s != o )
            && ( _swimbots[o].getAlive() )
            && ( _numNearbySwimbots < BRAIN_MAX_PERCEIVED_NEARBY_SWIMBOTS ))
            {
                let distanceSquared = _swimbots[s].getGenitalPosition().getDistanceSquaredTo( _swimbots[o].getGenitalPosition() );
                
                if ( distanceSquared < SWIMBOT_VIEW_RADIUS * SWIMBOT_VIEW_RADIUS )
                {                
                    if ( !_obstacle.getObstruction( _swimbots[s].getGenitalPosition(), _swimbots[o].getGenitalPosition() ) )
                    { 
                        _nearbySwimbotsArray[ _numNearbySwimbots ] = _swimbots[o];
                        _numNearbySwimbots ++;
                    }
                }
            }
        }
        
        //console.log( "_numNearbySwimbots = " + _numNearbySwimbots );
        
        
        /*
	    //----------------------------------
	    // find the closest food bit...
	    //----------------------------------
        let foundFoodBit = false;
        let smallestFoodBitDistanceSquared = 100000.0;
        for (let f=0; f<MAX_FOODBITS; f++)
        {
            if ( _foodBits[f].getAlive() )
            {
                let distanceSquared = _swimbots[s].getMouthPosition().getDistanceSquaredTo( _foodBits[f].getPosition() );
                if ( distanceSquared < smallestFoodBitDistanceSquared )
                {
                    if ( !_obstacle.getObstruction( _swimbots[s].getMouthPosition(), _foodBits[f].getPosition() ) )
                    { 
                        smallestFoodBitDistanceSquared = distanceSquared;
                        _chosenFoodBit = _foodBits[f];
                        foundFoodBit = true;
                    }
                }
            }
        }
        */

        /*

        let foundFoodBit = false;
        let smallestDistance = Number.MAX_SAFE_INTEGER;

        //if ( TEMP_USING_TWO_FOOD_COLORS )
        {
            //------------------------------------------------------
            // find the closest food bit that is also closest 
            // to the swimbot's preferred nutrition profile (food type)
            //------------------------------------------------------
            for (let f=0; f<MAX_FOODBITS; f++)
            {
                if ( _foodBits[f].getAlive() )
                {
                    let viewDistance = _swimbots[s].getMouthPosition().getDistanceTo( _foodBits[f].getPosition() );
                
                    if ( viewDistance < SWIMBOT_VIEW_RADIUS )
                    {                                
                        let distance = viewDistance / SWIMBOT_VIEW_RADIUS;
                    
                    
                        //----------------------------------------------------------------------------------
                        // take into account the desire for a food type profile (shown as color)
                        //----------------------------------------------------------------------------------
                        //let xx = _foodBits[f].getNutrition1() - 0.0;
                        //let yy = _foodBits[f].getNutrition2() - 0.0;
                        //let nutritionDistance = ( Math.abs( xx ) + Math.abs( yy ) ) * SWIMBOT_NUTRITION_FOOD_CHOICE_BIAS;
                        //distance += nutritionDistance;
                    
                                        
                        if ( distance < smallestDistance )
                        {
                            if ( !_obstacle.getObstruction( _swimbots[s].getMouthPosition(), _foodBits[f].getPosition() ) )
                            { 
                                smallestDistance = distance;
                                _chosenFoodBit = _foodBits[f];
                                foundFoodBit = true;
                            }
                        }
                    }
                }
            }
        }
        */
        
        /*
        else
        {
        */
        
        

        //------------------------------------------------------
        // find the closest food bit
        //------------------------------------------------------
        let foundFoodBit = false;
        let smallestDistance = Number.MAX_SAFE_INTEGER;
        for (let f=0; f<MAX_FOODBITS; f++)
        { 
            let okay = true;        

            //--------------------------------------------------------------------
            // In the current implementation, if the number of food types is 2, 
            // then the swimbot only "sees" a foodbit of its preferred type. 
            //--------------------------------------------------------------------
            if ( globalTweakers.numFoodTypes === 2 )
            {
                if ( _foodBits[f].getType() != _swimbots[s].getPreferredFoodType() )
                {
                    okay = false;
                }
            }

            if ( okay )
            {
                if ( _foodBits[f].getAlive() )
                {
                    let viewDistance = _swimbots[s].getMouthPosition().getDistanceTo( _foodBits[f].getPosition() );
                
                    if ( viewDistance < SWIMBOT_VIEW_RADIUS )
                    {                                
                        let distance = viewDistance / SWIMBOT_VIEW_RADIUS;
                    
                        if ( distance < smallestDistance )
                        {
                            if ( !_obstacle.getObstruction( _swimbots[s].getMouthPosition(), _foodBits[f].getPosition() ) )
                            { 
                                smallestDistance = distance;
                                _chosenFoodBit = _foodBits[f];
                                foundFoodBit = true;
                            }
                        }
                    }
                }
            }
        
            /*
            //------------------------------------------------------
            // find the closest food bit
            //------------------------------------------------------
            for (let f=0; f<MAX_FOODBITS; f++)
            { 
                if ( _foodBits[f].getAlive() )
                {
                    let viewDistance = _swimbots[s].getMouthPosition().getDistanceTo( _foodBits[f].getPosition() );
            
                    if ( viewDistance < SWIMBOT_VIEW_RADIUS )
                    {                                
                        let distance = viewDistance / SWIMBOT_VIEW_RADIUS;
                
                        if ( distance < smallestDistance )
                        {
                            if ( !_obstacle.getObstruction( _swimbots[s].getMouthPosition(), _foodBits[f].getPosition() ) )
                            { 
                                smallestDistance = distance;
                                _chosenFoodBit = _foodBits[f];
                                foundFoodBit = true;
                            }
                        }
                    }
                }
            }
            */   
        }     
        
	    //------------------------------------------------------------------------------
	    // pass these environmental stimuli along to the swimbot...
	    //------------------------------------------------------------------------------
        _swimbots[s].setEnvironmentalStimuli( _numNearbySwimbots, _nearbySwimbotsArray, foundFoodBit, _chosenFoodBit );
     }
     
    
	//----------------------------
	this.updateFood = function()
	{		
        let numType0FoodBits = 0;
        let numType1FoodBits = 0;
        
        //-------------------------------------
        // general update for all food bits
        //-------------------------------------
        for (let f=0; f<MAX_FOODBITS; f++)
        {
            if ( _foodBits[f].getAlive() )
            {
               _foodBits[f].update();

                if ( globalTweakers.numFoodTypes === 2 )
                {
                    //-----------------------------------------------------------------------
                    // calculate num foodbits of both types...
                    //-----------------------------------------------------------------------
                         if ( _foodBits[f].getType() === 0 ) { numType0FoodBits ++; }
                    else if ( _foodBits[f].getType() === 1 ) { numType1FoodBits ++; }
                
                    assert( ( ( _foodBits[f].getType() === 0 ) || ( _foodBits[f].getType() === 1 ) ), "genepool.updateFood: _foodBits[f].getType() invalid!" );                   
                    
                    assert( numType0FoodBits <= MAX_FOODBITS_PER_TYPE, "this.updateFood: numType0FoodBits > MAX_FOODBITS_PER_TYPE" );
                    assert( numType1FoodBits <= MAX_FOODBITS_PER_TYPE, "this.updateFood: numType1FoodBits > MAX_FOODBITS_PER_TYPE" );
                }            
            }
        }
        
        
        //-------------------------------------
        // periodically regenerate food
        //-------------------------------------
        assert( globalTweakers.foodRegenerationPeriod > 0, "GenePool:updateFood:globalTweakers.foodRegenerationPeriod > 0"  );
        
        if ( _clock % globalTweakers.foodRegenerationPeriod == 0 )
        {
            let childFoodBitIndex = this.findLowestDeadFoodBitInArray();
        
            //console.log( "time to spawn a new food bit" );
                    
            if ( childFoodBitIndex != NULL_INDEX )
            {            
                assert( ! _foodBits[ childFoodBitIndex ].getAlive(), "GenePool:updateFood: ! _foodBits[ childFoodBit ].getAlive" );

                //console.log( "I found a dead food bit to reincarnate, with ID " + childFoodBitIndex );

                let newFoodType = 0;
                let parentFoodBitIndex = this.findRandomLivingFoodBit( newFoodType ); 

                //-------------------------------------------------------------------------------------------------------
                // If we are using two types of food bits, then we need to do some housekeeping to make sure that 
                // neither type exceeds max population and also that there is always at least one bit of each type  
                //-------------------------------------------------------------------------------------------------------
                if ( globalTweakers.numFoodTypes === 2  )
                {
                    //------------------------------------------------------
                    // randomize the new food bit type, so that both
                    // food types have a chance to grow at the same rate.
                    //------------------------------------------------------
                    newFoodType = Math.floor( Math.random() * 2 );

                    //-------------------------------------------------------------------------------------
                    // make sure the number of food bits of both types do not exceed the maximum limit...
                    //-------------------------------------------------------------------------------------
                    /*
                    assert
                    ( 
                         ( ( numType0FoodBits < MAX_FOODBITS_PER_TYPE ) || ( numType1FoodBits < MAX_FOODBITS_PER_TYPE ) ),
                        "( ( numType0FoodBits < MAX_FOODBITS_PER_TYPE ) || ( numType1FoodBits < MAX_FOODBITS_PER_TYPE ) )"
                    );         
                    */
                                                   
                    if ( numType0FoodBits === MAX_FOODBITS_PER_TYPE )
                    {
                        newFoodType = 1;
                    }
                    else if ( numType1FoodBits === MAX_FOODBITS_PER_TYPE )
                    {
                        newFoodType = 0;
                    }

                    parentFoodBitIndex = this.findRandomLivingFoodBit( newFoodType ); 
                    
                    //-------------------------------------------------------------------
                    // If there are no more food bits left of a particular type, then
                    // I will force the child to have that type, and I will choose
                    // one of the existing food bits of the other type as its parent.
                    //-------------------------------------------------------------------
                    if ( numType0FoodBits === 0 ) 
                    { 
                        newFoodType = 0;
                        parentFoodBitIndex = this.findRandomLivingFoodBit(1); 
                    }

                    if ( numType1FoodBits === 0 ) 
                    { 
                        newFoodType = 1;
                        parentFoodBitIndex = this.findRandomLivingFoodBit(0); 
                    }                    
                }
                else
                {
                    assert( numType1FoodBits === 0, "genepool.js:updateFood: numType1FoodBits === 0" );
                }
                
                if ( parentFoodBitIndex != NULL_INDEX )
                {
                    //console.log( "I found a living food bit with ID " + parentFoodBitIndex + " of type " + newFoodType + " to be the parent." );
                    assert( ! _foodBits[ childFoodBitIndex ].getAlive(), "GenePool:updateFood: ! _foodBits[ childFoodBit ].getAlive" );
                    assert( childFoodBitIndex != _foodBits[ parentFoodBitIndex ].getIndex(), "genepool.js: updateFood: childFoodBitIndex != _foodBits[ parentFoodBitIndex ].getIndex()" );
                
                    //----------------------------------------------------------------
                    // spawn the child in a position relative to parent...
                    //----------------------------------------------------------------
                    _foodBits[ childFoodBitIndex ].spawnFromParent( _foodBits[ parentFoodBitIndex ], childFoodBitIndex, newFoodType );

                    //-------------------------------------------------------------------
                    // make sure the new food bit position is not obscured by
                    // the obstacle. If it is, keep trying new spawn positions...
                    //-------------------------------------------------------------------
                    let looking = true;
                    let num = 0;
                    while ( looking )                    
                    {                        
                        //----------------------------------------------------------------
                        // spawn the child to new position relative to parent...
                        //----------------------------------------------------------------
                        _foodBits[ childFoodBitIndex ].randomizeSpawnPosition( _foodBits[ parentFoodBitIndex ] );

                        if ( !_obstacle.getObstruction( _foodBits[ parentFoodBitIndex ].getPosition(), _foodBits[ childFoodBitIndex ].getPosition() ) )
                        {
                            looking = false;
                        }
                    
                        num ++;
                        if ( num > 10 )
                        {
                            looking = false;
                        }                        
                    }
                }
            }
        }        
        
        
        
        
        
        
        
        
        
        
        
        
        /*
        if ( globalTweakers.numFoodTypes === 2  )
        { 
            if ( _clock %100 === 0 )
            {
                console.log( "numType0FoodBits = " + numType0FoodBits + "; numType1FoodBits = " + numType1FoodBits  );	    
            }
            
            //------------------------------------------------------------------------
            // if there are no more food bits left of either type, then
            // create a new food bit of that type in a random location
            //------------------------------------------------------------------------
            if ( numType0FoodBits === 0 ) 
            { 
                console.log( "create new food bit of type 0" );	    
                let f = this.findLowestDeadFoodBitInArray();
                if ( f != NULL_INDEX )
                {
                    _vectorUtility.x = POOL_LEFT + POOL_WIDTH  * Math.random();
                    _vectorUtility.y = POOL_TOP  + POOL_HEIGHT * Math.random();
                    _foodBits[f].initialize(f); 
                    _foodBits[f].setType(0); 
                    _foodBits[f].setPosition( _vectorUtility ); 
                    _numFoodBits ++; 
                }
            }

            if ( numType1FoodBits === 0 ) 
            { 
                console.log( "create new food bit of type 1" );
                let f = this.findLowestDeadFoodBitInArray();
                if ( f != NULL_INDEX )
                {
                    _vectorUtility.x = POOL_LEFT + POOL_WIDTH  * Math.random();
                    _vectorUtility.y = POOL_TOP  + POOL_HEIGHT * Math.random();
                    _foodBits[f].initialize(f); 
                    _foodBits[f].setType(1); 
                    _foodBits[f].setPosition( _vectorUtility ); 
                    _numFoodBits ++; 
                }
            }        
        }
        
        	    
        //-------------------------------------
        // periodically regenerate food
        //-------------------------------------
        assert( globalTweakers.foodRegenerationPeriod > 0, "GenePool:updateFood:globalTweakers.foodRegenerationPeriod > 0"  );
        
        if ( _clock % globalTweakers.foodRegenerationPeriod == 0 )
        {
            let childFoodBitIndex = this.findLowestDeadFoodBitInArray();
            
            if ( childFoodBitIndex != NULL_INDEX )
            {
                assert( ! _foodBits[ childFoodBitIndex ].getAlive(), "GenePool:updateFood: ! _foodBits[ childFoodBit ].getAlive" );

                //let parentFoodType = 0;
                let childFoodType = 0;
                let numFoodBitsOfChildType = numType0FoodBits;
                
                //This is not working correctly yet:
                //------------------------------------------------------------------------------------------------------
                // Subtle: if the number of food bits of the parent type is maxed-out, and also...
                // if the number of foodbits of the child type is maxed-out, then the parent cannot spawn.  
                //------------------------------------------------------------------------------------------------------
                let okay = true;



                
if ( globalTweakers.numFoodTypes === 2 )
{ 
    //-------------------------------------------------------
    // 50% chance of being born with the other food type...
    //-------------------------------------------------------
    if ( Math.random() > ONE_HALF ) 
    {
        childFoodType = 1;
        numFoodBitsOfChildType  = numType1FoodBits;
    }

    //let childFoodType = parentFoodType;

    //let numFoodBitsOfParentType = numType0FoodBits;         

    //if ( parentFoodType === 1 ) { numFoodBitsOfParentType = numType1FoodBits; }
    //if ( childFoodType === 1 ) { ; }

    //assert( numFoodBitsOfParentType < MAX_FOODBITS_PER_TYPE, "GenePool.js:updateFood: numFoodBitsOfParentType < MAX_FOODBITS_PER_TYPE" );
    //assert( numFoodBitsOfChildType < MAX_FOODBITS_PER_TYPE, "GenePool.js:updateFood: numFoodBitsOfChildType  < MAX_FOODBITS_PER_TYPE" );

    if ( numFoodBitsOfChildType < MAX_FOODBITS_PER_TYPE )
    {
        okay = true;
    }
    else
    {
        okay = false;
    }
}





                if ( okay )
                {
                    let parentFoodBitIndex = this.findRandomLivingFoodBit( childFoodType );
                    //console.log( "parentFoodBitIndex parentFoodType = " + _foodBits[ parentFoodBitIndex ].getType() );

                    if ( parentFoodBitIndex != NULL_INDEX )
                    {
                        //console.log( parentFoodBitIndex );

                        assert( childFoodBitIndex != _foodBits[ parentFoodBitIndex ].getIndex(), "genepool.js: updateFood: childFoodBitIndex != _foodBits[ parentFoodBitIndex ].getIndex()" );
                    
                        //-------------------------------------------------------------------
                        // make sure the new food bit position is not obscured by
                        // the obstacle. If it is, keep trying new spawn positions...
                        //-------------------------------------------------------------------
                        let looking = true;
                        let num = 0;
                        while ( looking )                    
                        {                        
                            //----------------------------------------------------------------
                            // spawn the child to new position relative to parent...
                            //----------------------------------------------------------------
                            _foodBits[ childFoodBitIndex ].setSpawnPositionRelativeToParent( _foodBits[ parentFoodBitIndex ], childFoodBitIndex, childFoodType );

                            if ( !_obstacle.getObstruction( _foodBits[ parentFoodBitIndex ].getPosition(), _foodBits[ childFoodBitIndex ].getPosition() ) )
                            {
                                looking = false;
                            }
                        
                            num ++;
                            if ( num > 10 )
                            {
                                looking = false;
                            }                        
                        }
                    }
                }
            }
        }
            
            */
    }
    
    
	//--------------------------------
	this.setFoodSpread = function(s)
	{
	    //console.log( "setFoodSpread: " + s );
	    
        assert( s >= MIN_FOOD_BIT_MAX_SPAWN_RADIUS, "GenePool: setFoodSpread: s >= MIN_FOOD_BIT_MAX_SPAWN_RADIUS" )
        assert( s <= MAX_FOOD_BIT_MAX_SPAWN_RADIUS, "GenePool: setFoodSpread: s <= MAX_FOOD_BIT_MAX_SPAWN_RADIUS" )

        globalTweakers.foodSpread = s;

        for (let f=0; f<MAX_FOODBITS; f++)
        {
            _foodBits[f].setMaxSpawnRadius( globalTweakers.foodSpread );
        }
    }
    
	//--------------------------------
	this.setFoodBitEnergy = function(e)
	{
	    //console.log( "setFoodBitEnergy: " + e );	

        assert( e >= MIN_FOOD_BIT_ENERGY, "GenePool: setFoodBitEnergy: e >= MIN_FOOD_BIT_ENERGY" );
        assert( e <= MAX_FOOD_BIT_ENERGY, "GenePool: setFoodBitEnergy: e <= MAX_FOOD_BIT_ENERGY" );

        globalTweakers.foodBitEnergy = e;

        for (let f=0; f<MAX_FOODBITS; f++)
        {
            _foodBits[f].setEnergy( globalTweakers.foodBitEnergy );
        }
    }
    
	//--------------------------------
	this.setHungerThreshold = function(h)
	{
	    //console.log( "setHungerThreshold: " + h );	

        assert( h >= MIN_SWIMBOT_HUNGER_THRESHOLD, "GenePool: setHungerThreshold: h >= MIN_SWIMBOT_HUNGER_THRESHOLD" );
        assert( h <= MAX_SWIMBOT_HUNGER_THRESHOLD, "GenePool: setHungerThreshold: h <= MAX_SWIMBOT_HUNGER_THRESHOLD" );

	    globalTweakers.hungerThreshold = h;
	    
        for (let s=0; s<MAX_SWIMBOTS; s++)
        {
			_swimbots[s].setHungerThreshold( globalTweakers.hungerThreshold );
        }        	
    }
    
	//--------------------------------------
	this.setOffspringEnergyRatio = function(e)
	{
        //console.log( "setOffspringEnergyRatio: " + e );
	    
        assert( e >= MIN_CHILD_ENERGY_RATIO, "GenePool: setOffspringEnergyRatio: e >= MIN_CHILD_ENERGY_RATIO" );
        assert( e <= MAX_CHILD_ENERGY_RATIO, "GenePool: setOffspringEnergyRatio: e <= MAX_CHILD_ENERGY_RATIO" );
	    
        globalTweakers.childEnergyRatio = e;
    }
    
    
	//----------------------------------
	this.setFoodGrowthDelay = function(d)
	{
	    //console.log( "setFoodGrowthDelay: " + d );
	
        assert( d >= MIN_FOOD_REGENERATION_PERIOD, "setFoodGrowthDelay: d >= MIN_FOOD_REGENERATION_PERIOD" )
        assert( d <= MAX_FOOD_REGENERATION_PERIOD, "setFoodGrowthDelay: d <= MAX_FOOD_REGENERATION_PERIOD" )

	    globalTweakers.foodRegenerationPeriod = d;
    }


	//--------------------------------------
	this.setMaximumSwimbotAge = function(m)
	{
        assert( m >= MIN_MAXIMUM_AGE, "GenePool: setMaximumSwimbotAge: m >= MIN_MAXIMUM_AGE" );
        assert( m <= MAX_MAXIMUM_AGE, "GenePool: setMaximumSwimbotAge: m <= MAX_MAXIMUM_AGE" );
	    
        globalTweakers.maximumLifeSpan = m;
    }
    
    	
	//-------------------------------------------------------------
	this.findRandomLivingFoodBit = function( foodType )
	{		
        /*
	    let randomShift = Math.floor( Math.random() * MAX_FOODBITS );

        for (let i=0; i<MAX_FOODBITS; i++)
        {
            let f = ( i + randomShift ) % MAX_FOODBITS;

            assert( f < MAX_FOODBITS, "Genepool.js: f < MAX_FOODBITS" );
            assert( f >= -1, "Genepool.js:findRandomLivingFoodBit: assert( f >= -1)" );

            if ( _foodBits[f].getAlive() )
            {
                if ( _foodBits[f].getType() === foodType )
                {
                    return f;
                }
            }
        }

        return NULL_INDEX;
	    */
	
	
	
	
	
	    // original version
        let f = NULL_INDEX;
        let numTimesLooking = 200;
        let i = 0;
        let looking = true;
        
        while ( looking )
        {
            let testIndex = Math.floor( Math.random() * ( MAX_FOODBITS - 1 ) );
            
            //assert( testIndex < MAX_FOODBITS, "Genepool.js: testIndex < MAX_FOODBITS" );
            
            if ( _foodBits[ testIndex ].getAlive() )
            {
                if ( _foodBits[ testIndex ].getType() === foodType )
                {
                    f = testIndex;
                    looking = false;
                }
            }
            
            i ++;
            if ( i > numTimesLooking )
            {
                looking = false;
                //console.log( "failed to findRandomLivingFoodBit" );
            }
        }

        assert( f < MAX_FOODBITS, "Genepool.js: f < MAX_FOODBITS" );

        return f;
    }
    

	
	//----------------------------------------
	this.findLowestDeadFoodBitInArray = function()
	{		
        let f = NULL_INDEX;
        let t = NULL_INDEX;

        let looking = true;
        
        while ( looking )
        {
            t ++;

            if ( t < MAX_FOODBITS )
            {
                if ( ! _foodBits[t].getAlive() )
                {
                    f = t;
                    assert( f < MAX_FOODBITS, "Genepool.js: findLowestDeadFoodBitInArray: f < MAX_FOODBITS" );
                    looking = false;
                }
            }
            else
            {
                looking = false;
            }
         }

        return f;
    }

    
	//-------------------------------------------------
    this.createNewSwimbotWithGenes = function( genes )
    {
        let index = this.findLowestDeadSwimbotInArray();

        assert( index != NULL_INDEX, "GenePool.createNewSwimbotWithGenes: index != NULL_INDEX" );
           
        _myGenotype.setGenes( genes );
    
        let initialAge      = YOUNG_AGE_DURATION;          
        let initialAngle    = ZERO;
        let initialEnergy   = DEFAULT_SWIMBOT_HUNGER_THRESHOLD;
        
        _swimbots[ index ].create( index, initialAge, _camera.getPosition(), initialAngle, initialEnergy, _myGenotype, _embryology );			

        //-------------------------------------------------------
        // add the new swimbot to the family tree
        //-------------------------------------------------------
        _familyTree.addNode( index, NULL_INDEX, NULL_INDEX, _clock, this.getSwimbotGenes( index ) );


        setSelectedSwimbot( index );
    }


	//--------------------------------
    this.setPoolData = function( data )
    {
        //console.log( "loading pool file:" );
        //console.log( data );
                
        //-------------------------------------------
        // frozen or running?
        //-------------------------------------------
        _simulationRunning = data.simulationRunning;
        
        //-------------------------------
        // load food
        //-------------------------------
        _numFoodBits = data.numFoodBits;
        
        for (let f=0; f<MAX_FOODBITS; f++)
        {
            _foodBits[f].kill();
        }        

        for (let f=0; f<data.numFoodBits; f++)
        {
            let id = data.foodBitArray[f].id;
            
            _foodBits[ id ].initialize();
                
            let foodBitPosition = new Vector2D();
            foodBitPosition.setXY( data.foodBitArray[f].x, data.foodBitArray[f].y );
            _foodBits[ id ].setPosition( foodBitPosition );                
        }        

        //---------------------------------
        // load swimbots 
        //---------------------------------
        _numSwimbots = data.numSwimbots;

        for (let s=0; s<MAX_SWIMBOTS; s++)
        {
            _swimbots[s].die();
        }
       
        //----------------------------------------
        // reset family tree array
        //----------------------------------------  
        _familyTree.reset();

        //----------------------------------------
        // create the swimbots
        //----------------------------------------  
        for (let s=0; s<data.numSwimbots; s++)
        {
            let id = data.swimbotArray[s].id;
            
            let swimbotPosition = new Vector2D();
            swimbotPosition.setXY( data.swimbotArray[s].x, data.swimbotArray[s].y );  

            let loadedGenotype = new Genotype();
            loadedGenotype.setGenes( data.swimbotArray[s].genes );
            
            //this seems to be glitched - I must explore why
            //console.log( "s = " + s + "; id = " + id );            
            //assert( id === s, "GenePool.js: this.setPoolData: assert: id === s" );

            _swimbots[ id ].create
            ( 
                s,
                //id, //this seems to be glitched - I must explore why
                data.swimbotArray[s].age, 
                swimbotPosition, 
                data.swimbotArray[s].angle, 
                data.swimbotArray[s].energy, 
                loadedGenotype,
                _embryology 
            );		
            
            //------------------------------------------------------------------------------------
            // add the new swimbot to the family tree
            //------------------------------------------------------------------------------------
            _familyTree.addNode( id, NULL_INDEX, NULL_INDEX, _clock, this.getSwimbotGenes( id ) );
        }
        
        //----------------------------------------
        // camera
        //----------------------------------------        
        let cameraPosition = new Vector2D();
        cameraPosition.setXY( data.cameraX, data.cameraY );
        _camera.setPosition( cameraPosition );
        _camera.setScale( data.cameraScale );
        
        //------------------------
        // set view control
        //------------------------          
        _viewTracking.reset();
                
        //--------------------------------------------------------------
        // set tweakers
        //--------------------------------------------------------------           
        this.setFoodGrowthDelay     ( data.foodRegenerationPeriod   );
        this.setFoodSpread          ( data.foodSpread               );
        this.setFoodBitEnergy       ( data.foodBitEnergy            );
        this.setHungerThreshold     ( data.hungerThreshold          );
        this.setAttraction          ( data.attractionCriterion      );
        this.setOffspringEnergyRatio( data.childEnergyRatio         );
        
        _renderingGoals = data.renderingGoals;        


        //--------------------------------------------------------------
        // set obstacle
        //--------------------------------------------------------------   
        //to do        
		let end1 = new Vector2D();
		let end2 = new Vector2D();

        /*
		if ( data.obstacleEnd1X === undefined ) { console.log( data.obstacleEnd1X ); }
		if ( data.obstacleEnd1Y === undefined ) { console.log( data.obstacleEnd1Y ); }
		if ( data.obstacleEnd2X === undefined ) { console.log( data.obstacleEnd2X ); }
		if ( data.obstacleEnd2Y === undefined ) { console.log( data.obstacleEnd2Y ); }
		*/
		
		if (( data.obstacleEnd1X != undefined )
		&&  ( data.obstacleEnd1Y != undefined )
		&&  ( data.obstacleEnd2X != undefined )
		&&  ( data.obstacleEnd2Y != undefined ))
		{
    		end1.setXY( data.obstacleEnd1X, data.obstacleEnd1Y );
    		end2.setXY( data.obstacleEnd2X, data.obstacleEnd2Y );
        }
        else
        {
            //console.log( data.obstacleEnd1X + ", " + data.obstacleEnd1Y );		
            //console.log( data.obstacleEnd2X + ", " + data.obstacleEnd2Y );		

    		end1.setXY( 100, 100 );
    		end2.setXY( 200, 100 );
        }
        		
		
        _obstacle.setEndpointPositions( end1, end2 );
        
		//---------------------------------
		// start time
		//---------------------------------
		_startTime = (new Date).getTime();

		//----------------------------------
		// get seconds
		//----------------------------------
		_seconds = ( (new Date).getTime() - _startTime ) / MILLISECONDS_PER_SECOND;

		//----------------------------------
		// initialize pool
		//----------------------------------
	    _pool.initialize( _seconds );
	    
		//---------------------------------
		// clear this!
		//---------------------------------
        setSelectedSwimbot( NULL_INDEX );
        
		//---------------------------------
		// set clock to 0
		//---------------------------------
		_clock = 0;
    }
    
    //--------------------------------------
    // set selected swimbot
    //--------------------------------------
    function setSelectedSwimbot( index )
    {
        _selectedSwimbot = index;
        
// hey...maybe I need to turn off any other things that assume there is a selected swimbot...here        
        
    }
    
    
    
	//-------------------------------------
	this.makeNewRandomSwimbot = function()
	{		
	    let index = this.findLowestDeadSwimbotInArray();
	    
	    if ( index != NULL_INDEX )
	    {
            let initialAge      = YOUNG_AGE_DURATION;          
            let initialAngle    = getRandomAngleInDegrees(); //-180.0 + Math.random() * 360.0;
            let initialEnergy   = DEFAULT_SWIMBOT_HUNGER_THRESHOLD;
        
            _myGenotype.randomize();
        
            _swimbots[ index ].create( index, initialAge, _camera.getPosition(), initialAngle, initialEnergy, _myGenotype, _embryology );			

            //--------------------------------------------------
            // add the new swimbot to the family tree
            //--------------------------------------------------
            _familyTree.addNode( index, NULL_INDEX, NULL_INDEX, _clock, this.getSwimbotGenes( index ) );

            setSelectedSwimbot( index )
        }
        else
         {
             // cannot make random swimbot
         }
    }

	//---------------------------------------
	this.zapSwimbot = function( ID, amount )
	{		
        assert( ID != NULL_INDEX, "genepool: zapSwimbot: ID != NULL_INDEX" );
        _swimbots[ ID ].zap( _embryology, amount );
        _pool.endTouch( _swimbots[ ID ].getPosition(), _seconds );
    }

	//------------------------------------
	this.randomizeSwimbot = function( ID )
	{	
        assert( ID != NULL_INDEX, "genepool: randomizeSwimbot: ID != NULL_INDEX" );
	    this.zapSwimbot( ID, ONE );
	    _pool.endTouch( _swimbots[ ID ].getPosition(), _seconds );
	}
	
	
	//----------------------------------
	this.cloneSwimbot = function( ID )
	{		
        assert( ID != NULL_INDEX, "genepool: cloneSwimbot: ID != NULL_INDEX" );

        let index = this.findLowestDeadSwimbotInArray();
        
        if ( index != NULL_INDEX )
        {
            //let initialAge      = YOUNG_AGE_DURATION;          
            let initialAge      = _swimbots[ ID ].getAge();
            let initialAngle    = _swimbots[ ID ].getAngle();
            let initialEnergy   = _swimbots[ ID ].getEnergy() * ONE_HALF;
            let genotype        = _swimbots[ ID ].getGenotype();

            let initialPosition = new Vector2D();
            let p = new Vector2D();
            initialPosition.copyFrom( _swimbots[ ID ].getPosition() );
            p.copyFrom( initialPosition );
        
            initialPosition.x += CLONE_SEPARATION;
            p.x -= CLONE_SEPARATION;
        
            _swimbots[ ID ].setPosition(p);
            _swimbots[ ID ].setEnergy( initialEnergy ); // the clonee gets its energy halved as well as the cloned
            _swimbots[ index ].create( index, initialAge, initialPosition, initialAngle, initialEnergy, genotype, _embryology );			

            //--------------------------------------------------
            // add the new swimbot to the family tree
            //--------------------------------------------------
            _familyTree.addNode( index, NULL_INDEX, NULL_INDEX, _clock, this.getSwimbotGenes( index ) );

            setSelectedSwimbot( index )
        }
    }


	//------------------------------------
	this.killSwimbot = function( ID )
	{		
        assert( ID != NULL_INDEX, "genepool: killSwimbot: ID != NULL_INDEX" );

        //---------------------------------------------------------------------------
        // if this swimbot is one of the mutal lovers, then turn off mutal mode....
        //---------------------------------------------------------------------------
        if ( _viewTracking.getMode() === ViewTrackingMode.MUTUAL )
        {
            //console.log( "yea" );
            if (( _viewTracking.getLover1Index() === ID )             
            ||  ( _viewTracking.getLover2Index() === ID ))
            {   
                //_viewTracking.setMode( ViewTrackingMode.NULL );
                this.clearViewMode();
             }
        }
  
        //------------------------------
        // deselect, if selected....
        //------------------------------
        if ( _selectedSwimbot === ID )
        {
            setSelectedSwimbot( NULL_INDEX );
        }

        //------------------------------
        // kill that mofo....
        //------------------------------
        _swimbots[ ID ].die();
        
        //------------------------------
        // add a pool effect....
        //------------------------------
        _pool.endTouch( _swimbots[ ID ].getPosition(), _seconds );
    }
    
    
	//----------------------------------------
	this.updateCameraNavigation = function()
	{		
        if ( _panningLeft  ) {  _camera.panLeft (); }	
        if ( _panningRight ) {  _camera.panRight(); }	
        if ( _panningUp    ) {  _camera.panUp   (); }	
        if ( _panningDown  ) {  _camera.panDown (); }	
        if ( _zoomingIn    ) {  _camera.zoomIn  (); }	
        if ( _zoomingOut   ) {  _camera.zoomOut (); }	
	}
	


	//-----------------------------------------
	this.setSimulationRunning = function(s)
	{	
        _simulationRunning = s;
    }
    

	//-------------------------------
	this.setRendering = function(r)
	{	
        _rendering = r;
    }
    

	//-------------------------------------------
	this.setMillisecondsPerUpdate = function(m)
	{	
        _millisecondsPerUpdate = m;
    }
        

	//-----------------------------------
	this.toggleGoalOverlay = function()
	{	
        if ( _renderingGoals )
        {
            _renderingGoals = false;
        }
        else
        {
            _renderingGoals = true;
        }
        
        for (let s=0; s<MAX_SWIMBOTS; s++)
        {
            _swimbots[s].setRenderingGoals( _renderingGoals );
        }
    }    
    
	//---------------------------------------------------------------------
	// shift any food bit that maye be overlapping with the obstacle...
	//---------------------------------------------------------------------
    function moveFoodBitsFromObstacle()
    {
        for (let f=0; f<MAX_FOODBITS; f++)
        {
            if ( _foodBits[f].getAlive() )
            {
                if ( _obstacle.getCollision( _foodBits[f].getPosition(), 30 ) )
                {
                    _vectorUtility = _obstacle.getCurrentCollisionForce();
                    _vectorUtility.scale( 5 );
                    _foodBits[f].shiftPosition( _vectorUtility );

                }
            }                        
        }             
    }

	
	//-------------------------
	this.render = function()
	{
		//----------------------------------------------------------
		// set transform according to camera
		//----------------------------------------------------------
        let nx = _camera.getPosition().x / _camera.getXDimension();
        let ny = _camera.getPosition().y / _camera.getYDimension();

		let xTranslation = ( ONE_HALF - nx ) * _canvasWidth;
		let yTranslation = ( ONE_HALF - ny ) * _canvasHeight;

        let xScale = _canvasWidth  / _camera.getXDimension();
        let yScale = _canvasHeight / _camera.getYDimension();

		_canvas.translate( xTranslation, yTranslation );
        _canvas.scale( xScale, yScale ); 

		//----------------------------------
		// render the pool
		//----------------------------------
        _pool.render( _seconds, _camera );
        
		//-------------------------
		// render obstacle
		//-------------------------
		_obstacle.render( _camera );

		//-------------------------
		// render food
		//-------------------------
		this.renderFoodBits();

		//----------------------------------
		// render swimbots
		//----------------------------------
        for (let s=0; s<MAX_SWIMBOTS; s++)
        {
			if ( _swimbots[s].getAlive() )
			{			
                if ( _camera.getWithinView( _swimbots[s].getPosition(), _swimbots[s].getBoundingRadius() ) )
				{ 
                    _swimbots[s].render( _levelOfDetail );
      
                    if (( s === _mousedOverSwimbot )
                    ||  ( s === _selectedSwimbot   ))
                    {
                        if ( s === _selectedSwimbot )
                        {
                            renderSelectCircle( _swimbots[s].getPosition().x, _swimbots[s].getPosition().y, _swimbots[s].getSelectRadius(), false );
                        }
                        else
                        {
                            renderSelectCircle( _swimbots[s].getPosition().x, _swimbots[s].getPosition().y, _swimbots[s].getSelectRadius(), true );
                        }

                        _swimbots[s].setRenderingGoals( true );

                        if ( DEBUG_SHOW_SWIMBOT_TRAIL )
                        {
                            this.showSwimbotTrail(s);
                        }
                    }
                    else
                    {
                        if ( ! _renderingGoals )
                        {
                            _swimbots[s].setRenderingGoals( false );
                        }
					}
				}
			}
		}
		
		//-----------------------------------------------------------------------
		// when view is in mutual love mode, show a line between the lovers...
		//-----------------------------------------------------------------------
        if ( _viewTracking.getMode() === ViewTrackingMode.MUTUAL )
        {
            //console.log( "mutual" );            
            //console.log( _viewTracking.getLover1Index() + ", " + _viewTracking.getLover2Index() );            
            if (( _viewTracking.getLover1Index() != NULL_INDEX )
            &&  ( _viewTracking.getLover2Index() != NULL_INDEX ))
            {
                _canvas.lineCap = "round";
                _canvas.lineWidth = 5; 
                _canvas.strokeStyle = "rgba( 200, 200, 200, 0.06 )";   
                _canvas.moveTo( _swimbots[ _viewTracking.getLover1Index() ].getGenitalPosition().x, _swimbots[ _viewTracking.getLover1Index() ].getGenitalPosition().y );
                _canvas.lineTo( _swimbots[ _viewTracking.getLover2Index() ].getGenitalPosition().x, _swimbots[ _viewTracking.getLover2Index() ].getGenitalPosition().y );
                _canvas.stroke();

                _canvas.lineWidth = 2; 
                _canvas.strokeStyle = "rgba( 255, 255, 200, 0.06 )";   
                _canvas.moveTo( _swimbots[ _viewTracking.getLover1Index() ].getGenitalPosition().x, _swimbots[ _viewTracking.getLover1Index() ].getGenitalPosition().y );
                _canvas.lineTo( _swimbots[ _viewTracking.getLover2Index() ].getGenitalPosition().x, _swimbots[ _viewTracking.getLover2Index() ].getGenitalPosition().y );
                _canvas.stroke();
            }		
        }

		//---------------------
		// render camera
		//---------------------
		//renderCamera();

		//---------------------
		// reset transform
		//---------------------
        _canvas.resetTransform();
		
        /*
		//----------------------------------
		// render framerate
		//----------------------------------
        _canvas.font = "14px Arial";
		_canvas.fillStyle = "rgba( 255, 255, 255, 0.5 )";		
        _canvas.fillText( "framerate = " + _frameRate.toString(), _canvasWidth - 200, 20 ); 
        */       
        
		//----------------------------------
		// render view tracking info
		//----------------------------------
		let viewTrackingMode = _viewTracking.getMode();
		
		if ( viewTrackingMode != NULL_INDEX )
		{
		    let modeString = "(error)";
		    
    	         if ( viewTrackingMode === ViewTrackingMode.WHOLE_POOL ) { modeString = "viewing whole pool"         }
    		else if ( viewTrackingMode === ViewTrackingMode.AUTOTRACK  ) { modeString = "autotracking group"         }
    		else if ( viewTrackingMode === ViewTrackingMode.SELECTED   ) { modeString = "viewing selected swimbot"   }
    		else if ( viewTrackingMode === ViewTrackingMode.MUTUAL     ) { modeString = "viewing mutual love"        }
    		else if ( viewTrackingMode === ViewTrackingMode.PROLIFIC   ) { modeString = "viewing most prolific"      }
    		else if ( viewTrackingMode === ViewTrackingMode.EFFICIENT  ) { modeString = "viewing most efficient"     }
    		else if ( viewTrackingMode === ViewTrackingMode.VIRGIN     ) { modeString = "viewing oldest virgin"      }
    		else if ( viewTrackingMode === ViewTrackingMode.HUNGRY     ) { modeString = "viewing glutton"            }
		    
            _canvas.font = "14px Arial";
            _canvas.fillStyle = "rgba( 255, 255, 255, 0.5 )";		
            _canvas.fillText( modeString, _canvasWidth - 170, _canvasHeight - 30 );        
        }        
        
		//---------------------------
		// render touch state
		//---------------------------
		//_touch.render();
		
		//---------------------------
		// render border
		//---------------------------
        _canvas.lineWidth = 1; 
        _canvas.strokeStyle = "rgb( 0, 0, 0 )";   
		_canvas.strokeRect( 0, 0, _canvasWidth, _canvasHeight );
		/*     
        //_canvas.strokeStyle = "rgb( 220, 230, 240 )";
        _canvas.beginPath();
        _canvas.moveTo( 0, _canvasHeight );
        _canvas.lineTo( _canvasWidth, _canvasHeight );
        _canvas.closePath();
        _canvas.stroke();
        
        _canvas.beginPath();
        _canvas.moveTo( _canvasWidth, _canvasHeight );
        _canvas.lineTo( _canvasWidth, 0 );
        _canvas.closePath();
        _canvas.stroke();

        
        _canvas.beginPath();
        _canvas.moveTo( 0, 0 );
        _canvas.lineTo( 0, _canvasHeight );
        _canvas.closePath();
        _canvas.stroke();
        
        _canvas.beginPath();
        _canvas.moveTo( 0, 0 );
        _canvas.lineTo( _canvasWidth, 0 );
        _canvas.closePath();
        _canvas.stroke();
        */
	}
	
	
	/*
	//----------------------------------------
	function renderSwimbotSelectCircle( s, m )
	{
	    let lineWidth = 1.6 + 0.005 * _camera.getScale(); 	
	    let alpha = 0.07;	
	    	    
        if ( m )
        {
    	    alpha = 0.03;	
        }
        
        canvas.lineWidth = lineWidth;
        canvas.strokeStyle = "rgba( 255, 255, 255, " + alpha + " )";	
        canvas.beginPath();
        canvas.arc( _swimbots[s].getPosition().x, _swimbots[s].getPosition().y, _swimbots[s].getSelectRadius(), 0, PI2, false );
        canvas.stroke();
        canvas.closePath();	

        canvas.lineWidth = lineWidth * 0.4;
        canvas.strokeStyle = "rgba( 255, 255, 255, " + alpha + " )";
        canvas.beginPath();
        canvas.arc( _swimbots[s].getPosition().x, _swimbots[s].getPosition().y, _swimbots[s].getSelectRadius(), 0, PI2, false );
        canvas.stroke();
        canvas.closePath();		    
	}
	*/


	//----------------------------------------
	function renderSelectCircle( x, y, r, m )
	{
	    let lineWidth = 1.6 + 0.005 * _camera.getScale(); 	
	    let alpha = 0.07;	
	    	    
        if ( m )
        {
    	    alpha = 0.03;	
        }
        
        canvas.lineWidth = lineWidth;
        canvas.strokeStyle = "rgba( 255, 255, 255, " + alpha + " )";	
        canvas.beginPath();
        canvas.arc( x, y, r, 0, PI2, false );
        canvas.stroke();
        canvas.closePath();	

        canvas.lineWidth = lineWidth * 0.4;
        canvas.strokeStyle = "rgba( 255, 255, 255, " + alpha + " )";
        canvas.beginPath();
        canvas.arc( x, y, r, 0, PI2, false );
        canvas.stroke();
        canvas.closePath();		    
	}

	
	
	//-------------------------------
	function renderCamera()
	{
		_canvas.strokeStyle = "rgb( 255, 255, 255 )";		
		_canvas.lineWidth = _camera.getScale() * 0.007; 
		
		let spacing = 15;
		
		let x = _camera.getPosition().x - _camera.getXDimension() * ONE_HALF;
		let y = _camera.getPosition().y - _camera.getYDimension() * ONE_HALF;
		let w = _camera.getXDimension();
		let h = _camera.getYDimension();
		
		_canvas.strokeRect( x + spacing * ONE_HALF, y + spacing * ONE_HALF, w - spacing, h - spacing );

		_canvas.fillStyle = "rgb( 255, 255, 255 )";		
		_canvas.strokeRect
		( 
			_camera.getPosition().x - _camera.getXDimension() * 0.01, 
			_camera.getPosition().y - _camera.getYDimension() * 0.01, 0.01, 0.01
		);
    }
            		



	
	//-------------------------------
	this.renderFoodBits = function()
	{
        for (let f=0; f<MAX_FOODBITS; f++)
        {
            if ( _foodBits[f].getAlive() )
            {
                if ( _camera.getWithinView( _foodBits[f].getPosition(), FOOD_BIT_GRAB_RADIUS ) )
                {
                    _foodBits[f].render( _camera.getScale() );
                    
                    if ( f === _selectedFoodBit )
                    {
                        _foodBits[f].renderSelectOutline( _camera.getScale() );
                    }
                    
                    if ( f === _mousedOverFoodBit )
                    {
                        _foodBits[f].renderMousedOverOutline( _camera.getScale() );
                    }
                }
            }
        }
    }
 
	//--------------------------------------
	this.initializeDebugTrail = function(s)
	{
        for (let t=0; t<TRAIL_LENGTH; t++)
        {
            _debugTrail[t].set( _swimbots[s].getPosition() );
        }	
    }
 

	//-----------------------------------
	this.showSwimbotTrail = function(s)
	{
        //------------------------------------
        // update trail
        //------------------------------------
        if ( _clock % 20 == 0 )
        {
            for (let t=TRAIL_LENGTH-1; t>0; t--)
            {
                _debugTrail[t].set( _debugTrail[t-1] ); 
            }	

           _debugTrail[0].set( _swimbots[s].getPosition() ); 
        }

        //------------------------------------
        // render trail
        //------------------------------------
        _canvas.lineWidth = 2; 
        _canvas.strokeStyle = "rgb( 255, 255, 255 )";

        for (let t=1; t<TRAIL_LENGTH; t++)
        {
            _canvas.beginPath();
            _canvas.moveTo( _debugTrail[t-1].x, _debugTrail[t-1].y );
            _canvas.lineTo( _debugTrail[t].x, _debugTrail[t].y );
            _canvas.closePath();
            _canvas.stroke();
        }	
	}
	
	
	//----------------------------------------------------
	this.setGeneTweakCategory = function( swimbotIndex )
	{
	    //console.log( "setGeneTweakCategory: swimbotIndex = " + swimbotIndex );
    }
    
    
	//--------------------------------------------------------------
	this.tweakGene = function( swimbotIndex, geneIndex, geneValue )
	{
	    assert( swimbotIndex != NULL_INDEX, "genepool.js: tweakGene: swimbotIndex != NULL_INDEX"    );
	    assert( geneIndex    >= 0,          "genepool.js: tweakGene: geneIndex >= 0"                );
	    assert( geneIndex    < NUM_GENES,   "genepool.js: tweakGene: geneIndex    < NUM_GENES"      );
	    assert( geneValue    >= 0,          "genepool.js: tweakGene: geneValue    >= 0"             );
	    assert( geneValue    < BYTE_SIZE,   "genepool.js: tweakGene: geneValue    < BYTE_SIZE"      );
	    
	    //console.log( "uh, tweakGene: swimbotIndex = " + swimbotIndex + "; geneIndex = " + geneIndex  + "; geneValue = " + geneValue );
	    
	    _swimbots[ swimbotIndex ].setGeneValue( geneIndex, geneValue, _embryology );
	    
	    _vectorUtility.x = ZERO;
	    _vectorUtility.y = ZERO;
	    _swimbots[ swimbotIndex ].setVelocity( _vectorUtility );
    }


	//--------------------------------
	this.touchDown = function( x, y )
	{
        _touch.setToDown( x, y ); 	
       this.handleNonUITouchDownActions( x, y );
	}
	
	//--------------------------------------------------------------
	this.convertScreenCoordinatesToPoolPosition = function( x, y )
	{	
	    _vectorUtility.x = _camera.getPosition().x - _camera.getXDimension() * ONE_HALF + ( x / _canvasWidth  ) * _camera.getXDimension();
    	_vectorUtility.y = _camera.getPosition().y - _camera.getYDimension() * ONE_HALF + ( y / _canvasHeight ) * _camera.getYDimension(); 

	    return _vectorUtility;
    }
    	
	
	//-------------------------------
	this.touchMove = function( x, y )
	{	
        if (( x < _canvasWidth  )
        &&  ( y < _canvasHeight ))
    	{		
            _touch.setToMove( x, y );

            _vectorUtility = this.convertScreenCoordinatesToPoolPosition( x, y );
            _pool.moveTouch( _vectorUtility, _seconds );

            if (( _touch.getState() === TouchState.JUST_DOWN )
            ||  ( _touch.getState() === TouchState.BEEN_DOWN ))
            {
                //-----------------------------
                // dragging a swimbot around
                //-----------------------------
                if (( _swimbotBeingDragged )
                &&  ( _selectedSwimbot != NULL_INDEX ))
                {
                    _vectorUtility = this.convertScreenCoordinatesToPoolPosition( x, y );
                    _swimbots[ _selectedSwimbot ].setPosition( _vectorUtility );
                    
                    _vectorUtility.setXY( ZERO, ZERO );
                    _swimbots[ _selectedSwimbot ].setVelocity( _vectorUtility );
                }
                else if (( _foodBitBeingDragged )
                     &&  ( _selectedFoodBit != NULL_INDEX ))
                {
                    //-----------------------------
                    // dragging a fodbit around
                    //-----------------------------
                    _vectorUtility = this.convertScreenCoordinatesToPoolPosition( x, y );
                    _foodBits[ _selectedFoodBit ].setPosition( _vectorUtility );
                }
                else
                {
                    if ( _obstacle.getBeingMoved() )        
                    {
                        //--------------------------------------
                        // set the new moved position       
                        //--------------------------------------
                        _vectorUtility = this.convertScreenCoordinatesToPoolPosition( x, y );
                        _obstacle.setMovePosition( _vectorUtility );
                        
                        //--------------------------------------
                        // keep food away from obstacle       
                        //--------------------------------------
                        moveFoodBitsFromObstacle();
                    }    
                    else
                    {
                        let x = _touch.getVelocityX();
                        let y = _touch.getVelocityY();
                        _camera.drag( x, y );
                    }
                }
            }
            else
            {
                //throttle
                //if ( _clock % 4 == 0 )
                
                _vectorUtility = this.convertScreenCoordinatesToPoolPosition( x, y );

                //------------------------------------------------------------------------
                // check to see if the mouse if hovering over a swimbot or food bit
                //------------------------------------------------------------------------
                _mousedOverSwimbot = this.indexOfClosestSwimbotToScreenPosition( x, y );
                _mousedOverFoodBit = this.indexOfClosestFoodBitToScreenPosition( x, y );

                //------------------------------------------------------------
                // check to see if the mouse if hovering over the obstacle
                //------------------------------------------------------------
                _obstacle.detectHover( _vectorUtility )                 
            }		
        }
	}

	
	//-------------------------------
	this.touchUp = function( x, y )
	{
    	_touch.setToUp( x, y );
		
        _swimbotBeingDragged = false;
		_foodBitBeingDragged = false;
		
        //-----------------------------------------------------
        // if no button or swimbot or food bit was un-clicked
        //-----------------------------------------------------
		if (( _selectedSwimbot === NULL_INDEX )
        &&  ( _selectedFoodBit === NULL_INDEX ))
        {
            if ( _obstacle.getBeingMoved() )        
            {
                _obstacle.stopMoving();
            }    
        
            _vectorUtility = this.convertScreenCoordinatesToPoolPosition( x, y );
    		_pool.endTouch( _vectorUtility, _seconds );
	    }
    }

	
	//-------------------------------
	this.touchOut = function( x, y )
	{
        this.touchUp( x, y );
    }

	//------------------------------------
	this.touchTwoFingerMove = function(e)
	{
        if (( e.x < _canvasWidth  )
        &&  ( e.y < _canvasHeight ))
    	{		
            _camera.drag( -e.deltaX, -e.deltaY );  
            this.clearViewMode();
        }
    }
    
	//------------------------------------------------
	// start camera Navigation
	//------------------------------------------------
    this.startCameraNavigation = function( action )
    {
        _viewTracking.stopTracking();
        
             if ( action === CameraNavigationAction.LEFT  ) { _panningLeft  = true; }
        else if ( action === CameraNavigationAction.RIGHT ) { _panningRight = true; }
        else if ( action === CameraNavigationAction.DOWN  ) { _panningDown  = true; }
        else if ( action === CameraNavigationAction.UP    ) { _panningUp    = true; }
        else if ( action === CameraNavigationAction.IN    ) { _zoomingIn    = true; }
        else if ( action === CameraNavigationAction.OUT   ) { _zoomingOut   = true; }
	}
	
	//-----------------------------------------------
	// stop camera Navigation
	//-----------------------------------------------
    this.stopCameraNavigation = function( action )
    {
        _panningLeft    = false;	
        _panningRight   = false;
        _panningUp      = false;	
        _panningDown    = false;	
        _zoomingIn      = false;
        _zoomingOut     = false;
	}

	//-------------------------------
	this.clearViewMode = function()
	{
        this.setViewMode( ViewTrackingMode.NULL );
	}
	
	//--------------------------------------
	this.setViewMode = function( viewMode )
	{
        //console.log( "setViewMode to " + viewMode );
        //console.log( "_selectedSwimbot = " + _selectedSwimbot );
	
	    //-----------------------------------------------------------------------------------------
	    // if the new mode is "selected" but there is no swimbot selected, then bail out...
	    //-----------------------------------------------------------------------------------------	
	    if (( viewMode === ViewTrackingMode.SELECTED )
	    &&  ( _selectedSwimbot === NULL_INDEX ))
	    {	    
	        return;
        }
        	        	    
        let selectedSwimbot = _viewTracking.setMode( viewMode, _camera.getPosition(), _camera.getScale(), _selectedSwimbot );
        setSelectedSwimbot( selectedSwimbot );
	}
	
	//--------------------------------------------------
	this.handleNonUITouchDownActions = function( x, y )
	{
        if (( x < _canvasWidth  )
        &&  ( y < _canvasHeight ))
        {
            //-----------------------------------------------
            // in case view control is tracking, stop it...
            //-----------------------------------------------
            _viewTracking.stopTracking();
            
            //------------------------------------------
            // has a swimmer been clicked?
            //------------------------------------------
            setSelectedSwimbot( this.indexOfClosestSwimbotToScreenPosition( x, y ) );
        
            //------------------------------------------
            // a swimmer is clicked
            //------------------------------------------
            if ( _selectedSwimbot != NULL_INDEX )
            {
                _swimbotBeingDragged = true;
                this.initializeDebugTrail( _selectedSwimbot );
            }

            //--------------------------------------
            // find out if a foodbit was clicked
            //--------------------------------------
            if ( _selectedSwimbot === NULL_INDEX )
            {
                _selectedFoodBit = this.indexOfClosestFoodBitToScreenPosition( x, y );
                //console.log( _selectedFoodBit );
            
                if ( _selectedFoodBit != NULL_INDEX )
                {
                    _foodBitBeingDragged = true;
                }
            }
            else
            {
                _mousedOverFoodBit = NULL_INDEX;
            }
        
            //----------------------------------------
            // if no swimbot or food bit was clicked
            //----------------------------------------
            if (( _selectedSwimbot == NULL_INDEX )
            &&  ( _selectedFoodBit == NULL_INDEX ))
            {
                _vectorUtility = this.convertScreenCoordinatesToPoolPosition( x, y );
                
                //--------------------------------------
                // did the obstacle get touched?
                //--------------------------------------
                if ( _obstacle.detectHover( _vectorUtility ) )
                {
                    _obstacle.startMoving( _vectorUtility );
                }
                else
                {
                    //--------------------------------------
                    // touch the pool!
                    //--------------------------------------
                    _pool.startTouch( _vectorUtility, _seconds );
                }
            }
        }
    }	
	


	//----------------------------------------------
	this.indexOfClosestSwimbotToScreenPosition = function( x, y )
	{
        let indexOfClosest = NULL_INDEX;
        let closestDistance = 1000.0;
        
        for (let s=0; s<MAX_SWIMBOTS; s++)
        {
            if ( _swimbots[s].getAlive() )
            {
                _vectorUtility = this.convertScreenCoordinatesToPoolPosition( x, y );
                
                let distanceSquared = _swimbots[s].getPosition().getDistanceSquaredTo( _vectorUtility );
                if ( distanceSquared < _swimbots[s].getSelectRadius() * _swimbots[s].getSelectRadius() )
                {
                    if ( distanceSquared < closestDistance )
                    {
                        indexOfClosest = s;
                        closestDistance = distanceSquared;
                    }
                }
             }
        }
                
        return indexOfClosest;
    }
    
    


	//------------------------------------------------------------
	this.indexOfClosestFoodBitToScreenPosition = function( x, y )
	{
        let indexOfClosest = NULL_INDEX;
        let closestDistance = 1000.0;
        
        for (let f=0; f<MAX_FOODBITS; f++)
        {
            if ( _foodBits[f].getAlive() )
            {
                _vectorUtility = this.convertScreenCoordinatesToPoolPosition( x, y );
                
                let distanceSquared = _foodBits[f].getPosition().getDistanceSquaredTo( _vectorUtility );
                if ( distanceSquared < FOOD_BIT_GRAB_RADIUS * FOOD_BIT_GRAB_RADIUS )
                {
                    if ( distanceSquared < closestDistance )
                    {
                        indexOfClosest = f;
                        closestDistance = distanceSquared;
                    }
                }
             }
        }

        return indexOfClosest;
    }
    
    
    
	//------------------------------------------------------------------------------------
	// get functions....
	//------------------------------------------------------------------------------------
    
	
	//----------------------------------------------------------------------------
	// various quickie getters...
	//----------------------------------------------------------------------------
	this.getFoodGrowthDelay     = function() { return globalTweakers.foodRegenerationPeriod;          }
	this.getFoodSpread          = function() { return globalTweakers.foodSpread;        }
    this.getFoodBitEnergy       = function() { return globalTweakers.foodBitEnergy;     }
    this.getHungerThreshold     = function() { return globalTweakers.hungerThreshold;   }
    this.getEnergyToOffspring   = function() { return globalTweakers.childEnergyRatio;  }
    this.getMaximumSwimbotAge   = function() { return globalTweakers.maximumLifeSpan;   }
    this.getTimeStep            = function() { return _clock;                   }    
	this.getRenderingGoals      = function() { return _renderingGoals;          }
	this.getSimulationRunning   = function() { return _simulationRunning;       }
	this.getRendering           = function() { return _rendering;               }
	this.getSelectedSwimbotID   = function() { return _selectedSwimbot;         }
	this.getViewMode            = function() { return _viewTracking.getMode();  }
    
	//--------------------------------------------------
	// check to see if the camera navigation is active
	//--------------------------------------------------
    this.getCameraNavigationActive = function( action )
	{
	    let result = false;
	    
	    if ( ( action === CameraNavigationAction.LEFT  ) && ( _panningLeft  ) ) { result = true; } 
	    if ( ( action === CameraNavigationAction.RIGHT ) && ( _panningRight ) ) { result = true; } 
	    if ( ( action === CameraNavigationAction.DOWN  ) && ( _panningDown  ) ) { result = true; } 
	    if ( ( action === CameraNavigationAction.UP    ) && ( _panningUp    ) ) { result = true; } 
	    if ( ( action === CameraNavigationAction.IN    ) && ( _zoomingIn    ) ) { result = true; } 
	    if ( ( action === CameraNavigationAction.OUT   ) && ( _zoomingOut   ) ) { result = true; } 

        return result;
	}
	
	//----------------------------------------
	this.getASwimbotIsSelected = function()
	{
        if ( _selectedSwimbot != NULL_INDEX )
        {
            return true;
        }
	
	    return false;
    }	    

	//-----------------------------------
    this.getPresetGenotype = function(p)
    {
        _myGenotype.setToPreset(p);
            
        return _myGenotype.getGenes();
    }

	//------------------------------
	this.getNumFoodBits = function()
	{       
        let num = 0;
    
        for (let f=0; f<MAX_FOODBITS; f++)
        {
            if ( _foodBits[f].getAlive() )
            {
                if ( globalTweakers.numFoodTypes === 2  )
                {
                    if ( _foodBits[f].getType() === 0 )
                    {
                        num ++;
                    }
                }
                else
                {
                    num ++;
                }
            }
        }
    
        /*
        if ( globalTweakers.numFoodTypes === 2  )
        {
            for (let f=0; f<MAX_FOODBITS; f++)
            {
                if ( _foodBits[f].getAlive() )
                {
                    if ( _foodBits[f].getType() === 0 )
                    {
                        num ++;
                    }
                }
            }
        }        
        else
        {
            for (let f=0; f<MAX_FOODBITS; f++)
            {
                if ( _foodBits[f].getAlive() )
                {
                    num ++;
                }
            }
        }       
        */         
            
	    return num;	
	}

    /*
	//------------------------------
	this.getNumFoodBits0 = function()
	{       
        let num = 0;
        
        for (let f=0; f<MAX_FOODBITS; f++)
        {
            if ( _foodBits[f].getAlive() )
            {
                if ( _foodBits[f].getType() === 0 )
                {
                    num ++;
                }
            }
        }
                
	    return num;	
	}
    */
    
	//------------------------------
	this.getNumFoodBits1 = function()
	{       
        let num = 0;
        
        for (let f=0; f<MAX_FOODBITS; f++)
        {
            if ( _foodBits[f].getAlive() )
            {
                if ( _foodBits[f].getType() === 1 )
                {
                    num ++;
                }
            }
        }
                    
	    return num;	
	}

	//------------------------------
	this.getNumSwimbots = function()
	{       
        let num = 0;
        
        for (let s=0; s<MAX_SWIMBOTS; s++)
        {
            if ( _swimbots[s].getAlive() )
            {
                num ++;
            }
        }
                    
	    return num;	
	}
	

	//----------------------------
	this.getPoolData = function()
	{
	    //-----------------------------
	    // create foodbit array
	    //-----------------------------
        function FoodBitData()
        {
            this.id     = NULL_INDEX;
            this.x      = ZERO;
            this.y      = ZERO;
        }
        
	    let foodBitDataArray = new Array();
        
        let numFoodbits = 0;
        for (let f=0; f<MAX_FOODBITS; f++)
        {
            if ( _foodBits[f].getAlive() )
            {
                foodBitDataArray[ numFoodbits ] = new FoodBitData();
                foodBitDataArray[ numFoodbits ].id = f;
                foodBitDataArray[ numFoodbits ].x = _foodBits[f].getPosition().x;
                foodBitDataArray[ numFoodbits ].y = _foodBits[f].getPosition().y;

                numFoodbits ++;
            }
        }
 
	    //-------------------------
	    // create swimbot array
	    //-------------------------
        function SwimbotData()
        {
            this.x      = ZERO;
            this.y      = ZERO;
            this.angle  = ZERO;
            this.energy = ZERO;
            this.age    = 0;
            this.id     = 0;
            this.genes  = new Array();
        }
        
	    let swimbotDataArray = new Array();
	    
        let numSwimbots = 0;
        for (let s=0; s<MAX_SWIMBOTS; s++)
        {
            if ( _swimbots[s].getAlive() )
            {
                swimbotDataArray[ numSwimbots ] = new SwimbotData();
                swimbotDataArray[ numSwimbots ].id      = s;
                swimbotDataArray[ numSwimbots ].x       = _swimbots[s].getPosition().x;
                swimbotDataArray[ numSwimbots ].y       = _swimbots[s].getPosition().y;
                swimbotDataArray[ numSwimbots ].angle   = _swimbots[s].getAngle();
                swimbotDataArray[ numSwimbots ].age     = _swimbots[s].getAge();
                swimbotDataArray[ numSwimbots ].energy  = _swimbots[s].getEnergy();
                swimbotDataArray[ numSwimbots ].genes   = this.getSwimbotGenes(s);



//_myGenotype.randomize();   
//swimbotDataArray[ numSwimbots ].genes = _myGenotype;               
  
/*
for (let g=0; g<NUM_GENES; g++)
{
    swimbotDataArray[ numSwimbots ].genes[g] = Math.floor( Math.random() * 256.0 );               
}
*/
//data.swimbotArray[s].genes = _myGenotype;
      
//console.log( swimbotDataArray[ numSwimbots ].genes );          

//_myGenotype.randomize();     
//_myGenotype.copyFromGenotype( data.swimbotArray[s].genes );               


//swimbotDataArray[ numSwimbots ].genes = _swimbots[s].getGenotype();            


//console.log( swimbotDataArray[ numSwimbots ].genes );          

//_myGenotype.randomize();     

//data.swimbotArray[s].genes = _myGenotype;
      
//console.log( data.swimbotArray[s].genes );          

//swimbotDataArray[ numSwimbots ].genes = _myGenotype;

//_myGenotype.randomize();     
//data.swimbotArray[ numSwimbots ].genes = _myGenotype;
  
//_myGenotype.randomize();  //this.getSwimbotGenes(s);
//swimbotDataArray[ numSwimbots ].genes   = _myGenotype;
                
                
                
                numSwimbots ++;
            }
        }
	    
        let poolData = 
        { 
            "simulationRunning"         : _simulationRunning, 
            "numFoodBits"               : numFoodbits, 
            "numSwimbots"               : numSwimbots, 
            "foodBitArray"              : foodBitDataArray,
            "swimbotArray"              : swimbotDataArray,
            "cameraX"                   : _camera.getPosition().x,
            "cameraY"                   : _camera.getPosition().y,
            "cameraScale"               : _camera.getScale(),
            "foodRegenerationPeriod"    : globalTweakers.foodRegenerationPeriod,
            "foodSpread"                : globalTweakers.foodSpread,
            "foodBitEnergy"             : globalTweakers.foodBitEnergy,
            "hungerThreshold"           : globalTweakers.hungerThreshold,
            "attractionCriterion"       : globalTweakers.attractionCriterion,
            "childEnergyRatio"          : globalTweakers.childEnergyRatio,
            "renderingGoals"            : _renderingGoals,
            "obstacleEnd1X"             : _obstacle.getEnd1Position().x,
            "obstacleEnd1Y"             : _obstacle.getEnd1Position().y,
            "obstacleEnd2X"             : _obstacle.getEnd2Position().x,
            "obstacleEnd2Y"             : _obstacle.getEnd2Position().y
        }
        
        return poolData;
    }

    
	//------------------------------------
	this.getSwimbotGenes = function( ID )
	{		
        let genotype = _swimbots[ ID ].getGenotype();
        return genotype.getGenes();
    }	
    
	//----------------------------------
	this.getFamilyTree = function()
	{		
	    return _familyTree;
    }	
    
    
	//------------------------------
	this.getAttraction = function()
	{		
        return globalTweakers.attractionCriterion;
    }	
    
    
    
	//------------------------------
	this.getGeneName = function(g)
	{		
        //let genotype = _swimbots[0].getGenotype();
        //return genotype.getGeneName(g);
        
        return _embryology.getGeneName(g);
    }	
    
    
	//--------------------------------------------------
	this.getGeneValue = function( swimbotID, geneIndex )
	{
	    let genotype = _swimbots[ swimbotID ].getGenotype();

        return genotype.getGeneValue( geneIndex );
    }	
    
	//----------------------------------
	this.getNumGenesPerCategory = function()
	{
        return _embryology.getNumGenesPerCategory();
    }	
    
	//----------------------------------
	this.getNumGeneCategories = function()
	{
        return _embryology.getNumGeneCategories();
    }	
    
    
    
    
	
	//-----------------------------------------------------------------------------------------------------------------------------
	// swimbot getters...
	//-----------------------------------------------------------------------------------------------------------------------------
	this.getSwimbotIndex                    = function( ID ) {	return _swimbots[ ID ].getIndex                     (); }
    this.getSwimbotBrainState               = function( ID ) {	return _swimbots[ ID ].getBrainState                (); }
    this.getSwimbotChosenMate               = function( ID ) {	return _swimbots[ ID ].getChosenMateIndex           (); }
    this.getSwimbotAge                      = function( ID ) {	return _swimbots[ ID ].getAge                       (); }
    this.getSwimbotEnergy                   = function( ID ) {	return _swimbots[ ID ].getEnergy                    (); }
    this.getSwimbotNumFoodBitsEaten         = function( ID ) {	return _swimbots[ ID ].getNumFoodBitsEaten          (); }
    this.getSwimbotNumOffspring             = function( ID ) {	return _swimbots[ ID ].getNumOffspring              (); }
    this.getSwimbotAttractionDescription    = function( ID ) {	return _swimbots[ ID ].getAttractionDescription     (); }
    this.getSwimbotPreferredFoodType        = function( ID ) {	return _swimbots[ ID ].getPreferredFoodType         (); }
    this.getSwimbotDigestibleFoodType       = function( ID ) {	return _swimbots[ ID ].getDigestibleFoodType        (); }

    
    // this is now being initialized from the index.html...
	//--------------------------------
	// start this puppy
	//--------------------------------
    //this.initialize();
}


// === js/saveLoad.js ===
//--------------------------------------------------------------------------
//                                                                       
//    This file is part of GenePool Swimbots.                             
//    Copyright (c) 2021 by Jeffrey Ventrella - All Rights Reserved.      
//                                                                       
//    See the README file or go to swimbots.com for full license details.           
//    You may use, distribute, and modify this code only under the terms  
//    of the "Commons Clause" license (commonsclause.com).                
//                                                                       
//    This software is intended for education, game design, and research. 
//                                                                       
// -------------------------------------------------------------------------- 

"use strict";

const InputMode = 
{
    NULL                        : -1,
    LOAD_SWIMBOT_FROM_PRESET    :  0,
    LOAD_SWIMBOT_FROM_FILE      :  1,
    SAVE_SWIMBOT                :  2,
    LOAD_POOL_FROM_PRESET       :  3,
    LOAD_POOL_FROM_FILE         :  4,
    SAVE_POOL                   :  5
};

let _inputFilenameString    = "";
let _inputMode              = InputMode.NULL;
let _chosenPoolToLoad       = 0;

//-----------------------------------
function addToFilenameInputString(e)
{
    _inputFilenameString = e.currentTarget.value;
    
    if ( e.key === 'Enter' )
    {
        submitFilenameInput();
    }
}


//------------------------------
function submitFilenameInput()
{
    if ( _savedBeforeLoad )
    {
        loadPool();        
        _savedBeforeLoad = false;

        _inputMode = InputMode.LOAD_POOL_FROM_FILE;
    }
    else
    {    
        // load swimbot
        if ( _inputMode === InputMode.LOAD_SWIMBOT_FROM_FILE )
        {
            
            let swimbotLookup = _database.getLookupTable( 'swimbots' );

            let userOfSwimbot = "";

            let swimbotToLoad = swimbotLookup.find
            (
                function ( swimbot ) 
                {
                    userOfSwimbot = swimbot.user;
                    return swimbot.name === _inputFilenameString;
                }
            );
            
            if (( swimbotToLoad )
            &&  ( userOfSwimbot === _username ))
            {
                document.getElementById( 'PopUpPanelError' ).style.visibility = "visible";  
                document.getElementById( 'PopUpPanelError' ).style.borderWidth = 2; 
                document.getElementById( 'PopUpPanelError' ).style.borderColor = "#555555";
                document.getElementById( 'PopUpPanelError' ).innerHTML 
                = "<br>"
                + "&nbsp&nbsp loading data for swimbot '" + _inputFilenameString + "'";

                _database.loadObject
                (
                    'swimbots', 
                    swimbotToLoad.key, 
                
                    function( data ) 
                    {
                        if ( data ) 
                        {
                            genePool.createNewSwimbotWithGenes( data.genes );
                            closePopupPanel();
                            _inputFilenameString = "";
                        }
                    }
                );
            }
            else
            {
                document.getElementById( 'cancelErrorButton' ).style.visibility = "visible";  
                  
                document.getElementById( 'PopUpPanelError' ).style.visibility = "visible";        
                document.getElementById( 'PopUpPanelError' ).style.borderWidth = 5; 
                document.getElementById( 'PopUpPanelError' ).style.borderColor = "#883300";
                document.getElementById( 'PopUpPanelError' ).innerHTML 
                = "<br>"
                + "&nbsp&nbsp ERROR:"
                + "<br>"
                + "&nbsp&nbsp Could not find swimbot file '" + _inputFilenameString + "'"
                + "<br>"
                + "&nbsp&nbsp Try a different name";
            }
        }

        // save swimbot
        else if ( _inputMode === InputMode.SAVE_SWIMBOT )
        {
            let selectedSwimbot = genePool.getSelectedSwimbotID();

            if ( selectedSwimbot != -1 )
            {
                
                let date = new Date();
                let dateInSeconds = date.getTime();
            
                let genes = genePool.getSwimbotGenes( selectedSwimbot );
                let swimbotWithMetaData = ( { 'name': _inputFilenameString, 'date' : dateInSeconds, 'user': _username, 'genes': genes } );
            
                _database.add( 'swimbots', swimbotWithMetaData );            
                closePopupPanel();
                _inputFilenameString = "";
            }
        }
    
        // load pool
        else if ( _inputMode === InputMode.LOAD_POOL_FROM_FILE )
        {

             let poolLookup = _database.getLookupTable( 'pools' );

            let poolToLoad = poolLookup.find
            (
                function ( pool ) 
                {
                    return pool.name === _inputFilenameString;
                }
            );

            if ( poolToLoad ) 
            {
                document.getElementById( 'PopUpPanelError' ).style.visibility  = "visible";   
                document.getElementById( 'PopUpPanelError' ).style.borderWidth = 2; 
                document.getElementById( 'PopUpPanelError' ).style.borderColor = "#555555";
                document.getElementById( 'PopUpPanelError' ).innerHTML 
                = "<br>"
                + "&nbsp&nbsp loading data for pool '" + _inputFilenameString + "'";

                _database.loadObject
                (
                    'pools', 
                    poolToLoad.key, 
                
                    function( data ) 
                    {
                        if ( data ) 
                        {
                            genePool.setPoolData( data.pool );
                            closePopupPanel();
                            _inputFilenameString = "";
                        }
                    }
                );
            }       
            else
            {
                document.getElementById( 'PopUpPanelError' ).style.visibility  = "visible";  
                document.getElementById( 'PopUpPanelError' ).style.borderWidth = 5; 
                document.getElementById( 'PopUpPanelError' ).style.borderColor = "#883300";
                document.getElementById( 'PopUpPanelError' ).innerHTML 
                = "<br>"
                + "&nbsp&nbsp ERROR:"
                + "<br>"
                + "&nbsp&nbsp Could not find pool file '" + _inputFilenameString + "'"
                + "<br>"
                + "&nbsp&nbsp Try a different name";
            } 
        }
    
        // save pool
        else if ( _inputMode === InputMode.SAVE_POOL )
        {

             let date = new Date();
            let dateInSeconds = date.getTime();
            let pool = genePool.getPoolData();     
    
            let poolWithMetaData = ( { 'name': _inputFilenameString, 'date': dateInSeconds, 'user': _username, 'pool': pool } );       
    
            _database.add( 'pools', poolWithMetaData );
            closePopupPanel();
            _inputFilenameString = "";
        }

        // cancel input mode
        _inputMode = InputMode.NULL;
    }
}


//--------------------------------------------------
// these four save/load calls are made from html...
//--------------------------------------------------

function readLocalFile( event )
{
    let fileList = event.target.files;
    
    let file = fileList[0];   
    
    let reader = new FileReader();
    
    
}


//--------------------------
function printFamilyTree()
{

    genePool.generatePhyloTree();

    let w = window.open
     (
         "", 
         "swimbot data", 
         "left=400, top=100, width=600, height=700, status=0, resizable=0, channelmode=0, menubar=0, toolbar=0, location=0, titlebar=0" 
     );
    
    
    w.document.title = "Swimbot Data (copy and paste into a text file, then load into Gene Pool Lab)";

    let familyTree = genePool.getFamilyTree();
     
    let f = "";

    const THROTTLE = 5;

    for (let n = 0; n < familyTree.getNumNodes(); n += THROTTLE)
    {
        f += "swimbot index: " + n.toString();
        f += "<br>";
        f += "parent 1 index: " + familyTree.getNodeParent1Index(n).toString();
        f += "<br>";
        f += "parent 2 index: " + familyTree.getNodeParent2Index(n).toString();
        f += "<br>";
        f += "birth time: " + familyTree.getNodeBirthTime(n).toString();
        f += "<br>";
        f += "death time: " + familyTree.getNodeDeathTime(n).toString();
        f += "<br>";
        f += "genes: ";
        f += "<br>";

        let genes = familyTree.getNodeGenes(n);

        for (let g = 0; g < genes.length; g++)
        {
            f += genes[g].toString();
            if ( g < genes.length - 1 ) 
            {
                f += ", ";
            }
        }

        f += "<br>";
        f += "<br>";
    }

    w.document.body.innerHTML = f;
}


//--------------------
function loadPool()
{
    if ( _chosenPoolToLoad === SimulationStartMode.FILE )
    {
        openPopupPanelForInput( "Load a new pool from a file", InputMode.LOAD_POOL_FROM_FILE );               
    }
    else
    {
        switchToChosenPresetPool();
    }
}


//----------------------------------------------
function openPopupPanelForInput( text, mode )
{
    _inputMode = mode;   

    // make sure these are turned off  
    document.getElementById( 'noSavePopUpPanelButton'   ).style.visibility = "hidden";   
    document.getElementById( 'savePopUpPanelButton'     ).style.visibility = "hidden";  
    document.getElementById( 'dataDisplayButton'        ).style.visibility = "hidden";   

    // turn these on  
    document.getElementById( 'popUpPanel'               ).style.visibility = "visible";   
    document.getElementById( 'cancelPopUpPanelButton'   ).style.visibility = "visible";    
    document.getElementById( 'popUpPanelInput'          ).style.visibility = "visible";   
    document.getElementById( 'submitFilenameButton'     ).style.visibility = "visible";   

    // give focus to the input  
    document.getElementById( "popUpPanelInput" ).focus();     

    // default case...
    document.getElementById( "popUpPanelInput"      ).style.top = "185px";         
    document.getElementById( "submitFilenameButton" ).style.top = "185px";     

    if ( _inputMode === InputMode.SAVE_SWIMBOT )
    {
        document.getElementById( "loadedList"   ).style.visibility = "hidden";   
    
        document.getElementById( "PopupText" ).style.visibility = "visible";   
        document.getElementById( "PopupText" ).innerHTML 
        = text
        + "<br>"
        + "<br>"
        + "Name this swimbot...";

        // give user option to display data...  
        document.getElementById( 'dataDisplayButton'    ).style.visibility = "visible";   
    }
    else if ( _inputMode === InputMode.LOAD_SWIMBOT_FROM_FILE )
    {
        document.getElementById( "PopupText" ).style.visibility = "visible";   
        document.getElementById( "PopupText" ).innerHTML
        = text
        + "<br>"
        + "<br>"
        + "choose from the list of saved swimbots:"
        + "<br>"
        + "<br>";
        
        document.getElementById( "popUpPanelInput"      ).style.top = "290px";     
        document.getElementById( "submitFilenameButton" ).style.top = "290px";  

        document.getElementById( "loadedList" ).style.visibility = "visible";   
        document.getElementById( "loadedList" ).innerHTML = "";  
    
        let swimbotLookup = _database.getLookupTable( 'swimbots' );

        for (let s = 0; s < swimbotLookup.length; s++)
        {    
            if ( swimbotLookup[s].user === _username )
            {
                let loadSwimbotButton = document.createElement( "BUTTON" );

                loadSwimbotButton.id = "swimbotLoadButton_" + s.toString();

                loadSwimbotButton.innerHTML = swimbotLookup[s].name 

                document.getElementById( "loadedList" ).appendChild( loadSwimbotButton );

                loadSwimbotButton.onmousedown = function(e)
                 {
                     _inputFilenameString = swimbotLookup[s].name;
                    document.getElementById('popUpPanelInput').value = swimbotLookup[s].name;
                }
            }
        }
    }

    // clear-out input string...  
    _inputFilenameString = "";
    document.getElementById('popUpPanelInput').value = '';
}




//--------------------------------
function displayData( filename )
{
    if ( _inputMode === InputMode.SAVE_SWIMBOT )
    {
         showSwimbotGenes( genePool.getSelectedSwimbotID() );
    }
    else if ( _inputMode === InputMode.SAVE_POOL )
    {

         let pool = genePool.getPoolData();
        let json = JSON.stringify( { pool } );

        document.getElementById( 'dataDisplay'      ).style.visibility = "visible"; 
        document.getElementById( 'closeDataDisplay' ).style.visibility = "visible"; 
        document.getElementById( 'dataDisplay'      ).innerHTML
        = "Copy the text below, put it in a new text file, and then give"
        + "<br>" 
        + "the file a unique name ending in '.json' (example: 'my_pool.json')"
        + "<br>"
        + "<br>"
        + "_________________"
        + "<br>"
        + "<br>"
        + json;        
    }
}


//----------------------------
function showSwimbotGenes(s)
{
    if ( s != -1 )
    {        
        let genes = genePool.getSwimbotGenes(s);        
        let json = JSON.stringify( { genes } );
    
        document.getElementById( 'dataDisplay'      ).style.visibility = "visible"; 
        document.getElementById( 'closeDataDisplay' ).style.visibility = "visible"; 
        document.getElementById( 'dataDisplay'      ).innerHTML 
        = "<br>" 
        + "<big><b>Save genes of swimbot " + s.toString() + "</b></big>"
        + "<br>" 
        + "<br>" 
        + "Please copy the genetic data below and put it in an "
        + "<br>"
        + "empty text file. Give it a cool name and save it."
        + "<br>"
        + "<br>"
        + "This is formatted as JSON, which is required "
        + "<br>"
        + "for it to be loaded back into the pool."
        + "<br>"
        + "<br>"
        + "<br>"
        + "<br>"
        + json;
    }
}


//----------------------------
function closeDataDisplay()
{
    document.getElementById( 'dataDisplay'      ).style.visibility = "hidden"; 
    document.getElementById( 'closeDataDisplay' ).style.visibility = "hidden"; 
}


// === js/graph.js ===
//--------------------------------------------------------------------------
//                                                                        
//    This file is part of GenePool Swimbots.                             
//    Copyright (c) 2021 by Jeffrey Ventrella - All Rights Reserved.      
//                                                                        
//    See the README file or go to swimbots.com for full license details.           
//    You may use, distribute, and modify this code only under the terms  
//    of the "Commons Clause" license (commonsclause.com).                
//                                                                        
//    This software is intended for education, game design, and research. 
//                                                                        
// -------------------------------------------------------------------------- 

"use strict";

//const GRAPH_UPDATE_PERIOD = 50;


//------------------
function Graph()
{	
    const GRAPH_LEFT_MARGIN     = 20;
    const GRAPH_RIGHT_MARGIN    = 20;
    const GRAPH_BOTTOM_MARGIN   = 160;
    const GRAPH_TOP_MARGIN      = 40;
    const GRAPH_MAX_POPULATION  = 2000;
    const RECIPROCAL_OF_MAX_POP = 1 / GRAPH_MAX_POPULATION;
    const GRAPH_FOODBIT_COLOR   = "rgb( 20,  100,  20 )";
    const GRAPH_FOODBIT_1_COLOR = "rgb( 20,  100, 200 )";
    const GRAPH_SWIMBOT_COLOR   = "rgb( 200, 60,  20 )";
    //const GRAPH_SWIMBOT_1_COLOR = "rgb( 200,  20, 200 )";


//let _maxPopulationValue = 0;
	let _currentCount   = 0;
	let _left	        = 0;
	let _top            = 0;
	let _right	        = 0;
	let _bottom	        = 0;
	let _width	        = 0;
	let _height	        = 0;
	let _maxGraphCount  = 0;
    let _level1000      = 0;
    let _level0500      = 0;
    let _level0000      = 0;
    let _graphLeft	    = 0;
    let _graphRight	    = 0;
    let _graphBottom	= 0;
    let _graphTop	    = 0;
    let _graphWidth	    = 0;
    let _graphHeight    = 0;
	let _time           = new Array(); 
	let _numSwimbots    = new Array(); 
	//let _numSwimbots1   = new Array(); 
	let _numFoodBits    = new Array();
	    let _numFoodBits1   = new Array(); //kind of a hack - but I wanna get it working first....
	    let _graphContext   = null;
	    	let _graphCanvas    = null;

	    	//---------------------------
	        this.initialize = function()
	        {

	          	_currentCount = 0;
	          	_maxGraphCount = 20;

	        	_time = [];
	        	_numSwimbots  = [];
	                _numFoodBits  = [];
	                _numFoodBits1 = [];

	                _graphCanvas = document.getElementById( 'graphCanvas' );
	                _graphContext = _graphCanvas.getContext( '2d' );
	        }


	//---------------------------------------------------------------------
	this.update = function( time, numSwimbots, numFoodBits, numFoodBits1 )
	{	
        if ( _maxGraphCount	< 1000 )
        {
            _maxGraphCount ++;
        }	
	
        if ( _currentCount < _maxGraphCount )
        {
            _time		 [ _currentCount ] = time;
            _numSwimbots [ _currentCount ] = numSwimbots;
            //_numSwimbots1[ _currentCount ] = numSwimbots + 200;
            _numFoodBits [ _currentCount ] = numFoodBits;
            _numFoodBits1[ _currentCount ] = numFoodBits1;
        
            _currentCount ++;
        }
        else
        {
            _time		 [ _maxGraphCount ] = time;
            _numSwimbots [ _maxGraphCount ] = numSwimbots;
            //_numSwimbots1[ _maxGraphCount ] = numSwimbots + 200;
            _numFoodBits [ _maxGraphCount ] = numFoodBits;
            _numFoodBits1[ _maxGraphCount ] = numFoodBits1;
        
            this.scroll();
        }
    } 


	//-----------------------
		this.scroll = function()
		{
	        _time.splice(0, 1);
	        _numSwimbots.splice(0, 1);
	        _numFoodBits.splice(0, 1);
	        _numFoodBits1.splice(0, 1);
	    }
    

	//------------------------
		this.clear = function()
			{
				_graphContext.clearRect( 0, 0, _graphCanvas.width, _graphCanvas.height );
			}
	
	
	//------------------------
		this.render = function()
				{
			let graphCanvas   = _graphContext;

			_width  = _graphCanvas.width;
		_height = _graphCanvas.height;

_left = 0;
_top = 0;
	    
	    _bottom = _top  + _height;
	    _right  = _left + _width;
	    
        _graphLeft	    = _left        + GRAPH_LEFT_MARGIN;
        _graphRight	    = _right       - GRAPH_RIGHT_MARGIN;
        _graphBottom	= _bottom	   - GRAPH_BOTTOM_MARGIN;
        _graphTop	    = _top		   + GRAPH_TOP_MARGIN;
        _graphWidth	    = _graphRight  - _graphLeft;
        _graphHeight    = _graphBottom - _graphTop;

        _level1000	= _graphBottom - ( 1000	* RECIPROCAL_OF_MAX_POP ) * _graphHeight;
        _level0500	= _graphBottom - ( 500	* RECIPROCAL_OF_MAX_POP ) * _graphHeight;
        _level0000	= _graphBottom - (   0	* RECIPROCAL_OF_MAX_POP ) * _graphHeight;

        //-------------------------------
        // draw the box
        //-------------------------------
		graphCanvas.lineWidth = 1; 
        graphCanvas.fillStyle   = "rgb( 240, 238, 230 )";
        graphCanvas.strokeStyle = "rgb( 0, 0, 0 )";
        graphCanvas.fillRect  ( _graphLeft, _graphTop, _graphWidth, _graphHeight );
        graphCanvas.strokeRect( _graphLeft, _graphTop, _graphWidth, _graphHeight );
        
        //------------------------------------------------
        // render the horizontal lines 
        //------------------------------------------------
		graphCanvas.lineWidth = 1.0; 
        graphCanvas.strokeStyle = "rgba( 100, 100, 100, 0.5 )";
        graphCanvas.beginPath();
        graphCanvas.moveTo( _graphLeft,  _level1000 );
        graphCanvas.lineTo( _graphRight, _level1000 );
        graphCanvas.stroke();
        graphCanvas.closePath();

        graphCanvas.beginPath();
        graphCanvas.moveTo( _graphLeft,  _level0500 );
        graphCanvas.lineTo( _graphRight, _level0500 );
        graphCanvas.stroke();
        graphCanvas.closePath();
        
        //-------------------------------
        // render the actual graph
        //-------------------------------
        this.renderPopulationLines();
        
        //-------------------------------
        // show data
        //-------------------------------  
        if ( _currentCount > 1 )
        {
            //let timeStepString = _time       [ _currentCount -1 ].toString();
            //let swimbotString  = _numSwimbots[ _currentCount -1 ].toString();
            //let foodbitString  = _numFoodBits[ _currentCount -1 ].toString();
            //let foodbit1String = _numFoodBits1[ _currentCount -1 ].toString();
            
            let timeStep  = _bottom - GRAPH_BOTTOM_MARGIN +  30;
            let swimbotY  = _bottom - GRAPH_BOTTOM_MARGIN +  50;
          //let swimbot1  = _bottom - GRAPH_BOTTOM_MARGIN +  70;
            let foodbitY  = _bottom - GRAPH_BOTTOM_MARGIN +  67;
            let foodbit1Y = _bottom - GRAPH_BOTTOM_MARGIN +  84;
            
            let left = _graphLeft + 30;
             
            graphCanvas.clearRect( _graphLeft, _bottom - GRAPH_BOTTOM_MARGIN, _graphWidth, GRAPH_BOTTOM_MARGIN );
            
            graphCanvas.font = "20px Times";
            graphCanvas.fillStyle = "rgb( 100, 100, 100 )";	
            	
            graphCanvas.fillText( "0",      left, _level0000 -  8 );        
            graphCanvas.fillText( "500",    left, _level0500 +  8 );        
            graphCanvas.fillText( "1000",   left, _level1000 + 18 );        
            
            graphCanvas.lineWidth = 2; 
            graphCanvas.strokeStyle = GRAPH_FOODBIT_COLOR;
            graphCanvas.beginPath();
            graphCanvas.moveTo( left + 140, foodbitY );
            graphCanvas.lineTo( left + 250, foodbitY );
            graphCanvas.stroke();
            graphCanvas.closePath();

            graphCanvas.lineWidth = 2; 
            graphCanvas.strokeStyle = GRAPH_FOODBIT_1_COLOR;
            graphCanvas.beginPath();
            graphCanvas.moveTo( left + 140, foodbit1Y );
            graphCanvas.lineTo( left + 250, foodbit1Y );
            graphCanvas.stroke();
            graphCanvas.closePath();

            graphCanvas.lineWidth = 2; 
            graphCanvas.strokeStyle = GRAPH_SWIMBOT_COLOR;
            graphCanvas.beginPath();
            graphCanvas.moveTo( left + 140, swimbotY );
            graphCanvas.lineTo( left + 250, swimbotY );
            graphCanvas.stroke();
            graphCanvas.closePath();

            /*
            graphCanvas.lineWidth = 2; 
            graphCanvas.strokeStyle = GRAPH_SWIMBOT_1_COLOR;
            graphCanvas.beginPath();
            graphCanvas.moveTo( left + 120, swimbot1 - 6 );
            graphCanvas.lineTo( left + 180, swimbot1 - 6 );
            graphCanvas.stroke();
            graphCanvas.closePath();
            */
        }
        
    
        /*
        int textSize = 14;
        graphics.setTextSize( textSize );

        //---------------------------------------------------------
        // render the label for 'population'
        //---------------------------------------------------------
        graphics.setColor( 0.9, 0.9, 0.9 ); 
        graphics.drawString( "Population Graph", graphLeft, graphTop - 5 );	
    
        //---------------------------------------------------------
        // render the labels for time
        //---------------------------------------------------------
        long startTime	= 0;
        long endTime		= GRAPH_TIME_SPAN;
    
        if ( time[ currentCount - 1 ] > GRAPH_TIME_SPAN )
        {
            startTime	= time[0];
            endTime		= time[ currentCount - 1 ];
        }
    
        sprintf( startTimeLabel,	"%ld", startTime	);
        sprintf( endTimeLabel,		"%ld", endTime	);

        graphics.setColor( 0.0, 0.0, 0.0 );
        graphics.drawString( startTimeLabel,	graphLeft,						graphBottom + textSize );	
        graphics.drawString( "time",			left + width * ONE_HALF - 10.0, graphBottom + textSize );	
        graphics.drawString( endTimeLabel,		graphRight - 60,				graphBottom + textSize );	
    
        //---------------------------------------------------------
        // render the numbers for the populations
        //---------------------------------------------------------
        if ( currentCount > 0 )
        {
            sprintf( timeLabel,		"time: %ld",		time		[ currentCount - 1 ] );
            sprintf( swimbotLabel,	"swimbots: %d",		numSwimbots	[ currentCount - 1 ] );
            sprintf( foodBitLabel,	"food bits: %d",	numFoodBits	[ currentCount - 1 ] );

            graphics.setColor( 0.8, 0.8, 0.8 ); graphics.drawString( timeLabel,		graphLeft,	bottom - textSize - textSize * 2.4 );	
            graphics.setColor( 1.0, 0.9, 0.8 );	graphics.drawString( swimbotLabel,	graphLeft,	bottom - textSize - textSize * 1.2 );	
            graphics.setColor( 0.4, 1.0, 0.4 );	graphics.drawString( foodBitLabel,	graphLeft,	bottom - textSize - textSize * 0.0 );	
        }
        */
    }
    
    

	//---------------------------------------
		this.renderPopulationLines = function()
		{	
	        let graphCanvas   = _graphContext;

	             let xInc = _width / ( _maxGraphCount );

			graphCanvas.lineWidth = 1.0; 


	        for (let g=1; g<_currentCount; g++ )
        {
            let xFraction = (g - 1 ) / _maxGraphCount;        
            let x1	= _graphLeft + xFraction * _graphWidth;
            let x2	= x1 + xInc;
            
            let foodY1      = _graphBottom - ( _numFoodBits [g-1] * RECIPROCAL_OF_MAX_POP ) * _graphHeight;
            let foodY2      = _graphBottom - ( _numFoodBits [g  ] * RECIPROCAL_OF_MAX_POP ) * _graphHeight;

            let food1Y1     = _graphBottom - ( _numFoodBits1[g-1] * RECIPROCAL_OF_MAX_POP ) * _graphHeight;
            let food1Y2     = _graphBottom - ( _numFoodBits1[g  ] * RECIPROCAL_OF_MAX_POP ) * _graphHeight;
            
            let swimbotY1   = _graphBottom - ( _numSwimbots [g-1] * RECIPROCAL_OF_MAX_POP ) * _graphHeight;
            let swimbotY2   = _graphBottom - ( _numSwimbots [g  ] * RECIPROCAL_OF_MAX_POP ) * _graphHeight;

            //let swimbot1Y1  = _graphBottom - ( _numSwimbots1[g-1] * RECIPROCAL_OF_MAX_POP ) * _graphHeight;
            //let swimbot1Y2  = _graphBottom - ( _numSwimbots1[g  ] * RECIPROCAL_OF_MAX_POP ) * _graphHeight;

            if ( foodY2 > _graphBottom - _graphHeight )
            {
                graphCanvas.strokeStyle = GRAPH_FOODBIT_COLOR;
                graphCanvas.beginPath();
                graphCanvas.moveTo( x1, foodY1 );
                graphCanvas.lineTo( x2, foodY2 );
                graphCanvas.stroke();
                graphCanvas.closePath();
            }
        
            if ( food1Y2 > _graphBottom - _graphHeight )
            {
                graphCanvas.strokeStyle = GRAPH_FOODBIT_1_COLOR;
                graphCanvas.beginPath();
                graphCanvas.moveTo( x1, food1Y1 );
                graphCanvas.lineTo( x2, food1Y2 );
                graphCanvas.stroke();
                graphCanvas.closePath();
            }
            
            if ( swimbotY2 > _graphBottom - _graphHeight )
            {
                graphCanvas.strokeStyle = GRAPH_SWIMBOT_COLOR;
                graphCanvas.beginPath();
                graphCanvas.moveTo( x1, swimbotY1 );
                graphCanvas.lineTo( x2, swimbotY2 );
                graphCanvas.stroke();
                graphCanvas.closePath();
            }
            
            /*
            if ( swimbot1Y2 > _graphBottom - _graphHeight )
            {
                graphCanvas.strokeStyle = GRAPH_SWIMBOT_1_COLOR;
                graphCanvas.beginPath();

                //graphCanvas.moveTo( x1, swimbot1Y1 );
                //graphCanvas.lineTo( x2, swimbot1Y2 );

                graphCanvas.moveTo( x1, swimbot1Y1 );
                graphCanvas.lineTo( x2, swimbot1Y2 );

                graphCanvas.stroke();
                graphCanvas.closePath();
            }
            */
        }
     }

}				
				
				
		

// === js/info.js ===
//--------------------------------------------------------------------------
//                                                                        
//    This file is part of GenePool Swimbots.                             
//    Copyright (c) 2021 by Jeffrey Ventrella - All Rights Reserved.      
//                                                                        
//    See the README file or go to swimbots.com for full license details.           
//    You may use, distribute, and modify this code only under the terms  
//    of the "Commons Clause" license (commonsclause.com).                
//                                                                        
//    This software is intended for education, game design, and research. 
//                                                                        
// -------------------------------------------------------------------------- 

"use strict";

//----------------------------
function getInfoText( page )
{
    let text = "";
    
    //--------------------------------
    if ( page === 1 )
    {
        text
        = "<big><b>1. This is Gene Pool</b></big>"
        + "<br>"          
        + "<br>"          
        
        /*
        + "(c) 2021, Jeffrey Ventrella<br>"
        + "<a href = 'http://www.ventrella.com/' target = '_blank' style = 'text-decoration:none'>www.ventrella.com</a>"
        + "<br>"          
        + "<br>"          
        */
        
        + "Witness the effects of Darwinian evolution as hundreds of simulated organisms compete for mates and food. Explore this virtual aquarium of proto-swimming robots ('swimbots'), and see how mate preference can affect the course of evolution." 
        + "<br>"          
        + "<br>"          
        
        + "Watch the emergence of a dominant race of swimmers in about 30 minutes. Keep it running for longer and swimming skills will improve, where swimming 'skill' is determined entirely by natural selection."
        + "<br>"          
        + "<br>"          
        + "Every time you start a new pool, the outcome will be different."   
    }
    
    //--------------------------------
    else if ( page === 2 )
    {
        text
        = "<big><b>2. How to use Gene Pool</b></big>"
        + "<br>"
        + "<br>"
        
        + "1  Go to the 'pool' menu and start up a random pool."
        + "<br>"
        + "<br>"
        
        + "2  Explore the variety of swimbots using the view controls."
        + "<br>"
        + "<br>"
        
        + "3  If you want, you can help the swimbots by moving them around along with food bits (but don't help too much!)"
        + "<br>"
        + "<br>"
        
        + "4  Let Mother Nature do Her thing. Then come back after a while and choose the 'graph' menu to see how many swimbots there are. By around 50,000 time steps, a dominant race may have evolved. Sometimes everyone dies. That's not a software bug - that's nature!"    
        + "<br>"
        + "<br>"
        
        + "5  To save a swimbot or the state of the whole pool, you have to create a user account. Then you will be able to save and load swimbots ('swimbot' menu), and pools ('pool' menu)."   
    }
    
    //--------------------------------
    else if ( page === 3 )
    {
        text
        = "<big><b>3. Background</b></big>"
        + "<br>"
        + "<br>"
        + "This simulation is derived from an artificial life game called Darwin Pond (www.darwinpond.com). It was created by Jeffrey Ventrella at around 1996 for Rocket Science Games. Brian Dodd implemented it in Windows and also helped create some features. He has since helped develop several other games for <a href = 'http://www.wiggleplanet.com/' target = '_blank' style = 'text-decoration:none'>Wiggle Planet</a>."
        + "<br>"
        + "<br>"
        + "More detail can be found in a paper called 'Attractiveness vs. Efficiency, (How Mate Preference Affects Locomotion in the Evolution of Artificial Swimming Organisms)', MIT Press (Artificial Life VI Proceedings)."
        + "<br>"
        + "<br> "                   
        + "More background on this simulation can be found at www.Ventrella.com, as well as other biologically-inspired computer animations."   
    }
    
    //--------------------------------
    else if ( page === 4 )
    {
        text
        = "<big><b>4. Attractiveness vs. Efficiency</b></big>" 
        + "<br>" 
        + "<br>" 
        + "How important is it to be beautiful? Even though the male peacock has to work to carry around that costly tail it comes in handy when it is time to attract mates thus it is important for reproduction." 
        + "<br>" 
        + "<br>"                   
        + "The swimbots in Gene Pool normally choose to mate with others that exhibit similar colors. But if you switch this to one of the other available preferences, you can cause evolution to go in some interesting directions." 
        + "<br>" 
        + "<br>"                   
        + "Such explorations help to demonstrate the subtle interactions between two evolutionary forces recognized by Darwin: natural selection, and sexual selection."   
    }
    //--------------------------------
    else if ( page === 5 )
    {
        text
        = "<big><b>5. Swimbots</b></big>"            
        + "<br>"
        + "<br>"                   
        + "In Gene Pool, a population of proto-swimming machines called 'swimbots' evolves improved morphology and motor control for locomotion in a virtual fluid. Swimbots have two goals in life:"
        + "<br>"
        + "<br>"                    
        + "1.  to eat" 
        + "<br>"
        + "2.  to mate" 
        + "<br>"
        + "<br>"                             
        + "(not necessarily in that order). Their entire lives are spent pursuing these two goals."
        + "<br>"
        + "<br>"                              
        + "By clicking on a swimbot, and then choosing the 'swimbot' menu, you can monitor its vital signs."   
    }
    
    //--------------------------------
    else if ( page === 6 )
    {
        text
        = "<big><b>6. Darwinian Fitness</b></big>"
        + "<br>"
        + "<br>"
        + "If a swimbot is able to swim to another swimbot with which it wants to mate, then it has an offspring. Swimbots who are better at swimming, and swimbots who are more 'attractive' (i.e., chosen often as potential mates) have more offspring."
        + "<br>"
        + "<br>"
        + "In Gene Pool, the definition of 'fitness' is how good a swimbot is at reproducing, which means either being good at swimming, or just being attractive to other swimbots."   
    }
    
    //--------------------------------
    else if ( page === 7 )
    {
        text
        = "<big><b>7. Energy</b></big>"             
        + "<br>"
        + "<br>"
        + "Ambient energy in the pool is continually converted into food bits, which periodically send off spores and spread throughout the pool. Food bits are then eaten by swimbots. When swimbots move, they burn energy, which is then absorbed back into the pool."
        + "<br>"
        + "<br>"
        + "When a swimbot's energy is low, it becomes hungry, and must find a food bit to eat. Swimbots who are more energy-efficient don't need to eat as much, and can spend more of their lives mating."
    }
    
    //--------------------------------
    else if ( page === 8 )
    {
        text
        = "<big><b>8. Bodies</b></big>"
        + "<br>"
        + "<br>"
        + "Swimbots are made of parts. Parts are rigidly connected from end-to-end, and rotate at their joints in pendulum fashion. Parts come in a large variety of colors, lengths, and widths. Many genes are involved in determining the ways these parts are put together, and the amplitudes and phases of their angular motions."
        + "<br>"
        + "<br>"               
        + "None of these parts are associated with any explicit functions, as in the case of a 'limb', 'torso', 'fin', 'pseudopod', etc. However, there is one part (the base part) which has a 'genital' at one end and a 'mouth' at the other end. The purposes of these should be obvious.";
    }
    
    //--------------------------------
    else if ( page === 9 )
    {
        text
        = "<big><b>9. Embryology</b></big>"
        + "<br>"
        + "<br>"
        + "When a swimbot is born, a number of genes jump into action and begin a process whereby the various aspects of the body and motor control are determined. This is done via a recursive algorithm. "
        + "<br>"
        + "<br>"
        + "As a body is being made, part-by-part, the widths, lengths, colors, angles, and other attributes, are created, giving rise to cumulative effects. Some genes determine whether there is limb-branching and the nature of that branching. Other genes determine how motor control attributes are set as parts grow."
    }
    
    //--------------------------------
    else if ( page === 10 )
    {
        text
        = "<big><b>10. Genetic Engineering</b></big>"
        + "<br>"
        + "<br>"
        + "The swimbot dialog has a button for tweaking the genes of the selected swimbot. Many of these genes have effects that are difficult to predict, and some of them inhibit other genes, causing them to have no effect when you tweak them. Not even the designer of the embryology scheme can explain all of the effects caused by the combination of these genes. That's the nature of Designing Emergence: the outcome is unpredictable." 
        + "<br>"
        + "<br>"
        + "It helps to know that there is a kind of 'embryogenesis' that has cumulative effects on attributes. Also, a swimbot can have as many as three 'categories' of parts, and you can tweak the associated genes by selecting one of the sets. "
    }
    
    //--------------------------------
    else if ( page === 11 )
    {
        text
        = "<big><b>11. How to Recognize Genitals and Mouths</b></big>"
        + "<br>"
        + "<br>"
        + "When a swimbot is interested in mating, you can see a white line sticking out of its body. That is its genital. If it has fallen in love, an arrow appears at the end of the line, and it aims in the direction of its chosen mate."
        + "<br>"
        + "<br>"
        + "When it is hungry, you can see a green line sticking out of another region on the body. This is its mouth. If the swimbot has found a food bit, it opens up to become two lines, and aims in the direction of its chosen food bit."
    }
    
    //--------------------------------
    else if ( page === 12 )
    {
        text
        = "<big><b>12. Brain and Sensors</b></big>"
        + "<br>"
        + "<br>"
        + "Swimbots have four mental states: "
        + "<br>"
        + "<br>"
        + "(1) Looking for a mate "
        + "<br>"
        + "(2) Pursuing a mate it has chosen "
        + "<br>"
        + "(3) Looking for a food bit "
        + "<br>"
        + "(4) Pursuing a food bit it has chosen "
        + "<br>"
        + "<br>"
        + "A swimbot relies on only two sensors: "
        + "<br>"
        + "<br>"
        + "(1) its own energy, which determines its hunger and whether it will pursue food or mates" 
        + "<br>"
        + "<br>"
        + "(2) the direction of a chosen mate or food bit - which affects its turning behaviors."
    }
    
    //--------------------------------
    else if ( page === 13 )
    {
        text
        = "<big><b>13. Motion</b></big>"
        + "<br>"
        + "<br>"
        + "Every part's characteristic motion is determined by the amplitudes and phases of the sine waves. And this is determined at birth in the embryological phase. The amplitudes and phases are modulated by the direction of a chosen food bit or mate, at any given time. From birth until death, the swimbot will always be rotating its parts. Only in starvation, old age, and the moments after mating will there be any slowing of this clock-work motion. "
        + "<br>"
        + "<br>"
        + "Since there are many parts, and a large number of gene combinations, there are consequently many possible motion styles: the motion phenotype space is very large indeed."
    }
    
    //--------------------------------
    else if ( page === 14 )
    {
        text
        = "<big><b>14. The Physics of Swimming</b></big>"
        + "<br>"
        + "<br>"
        + "A forward dynamics algorithm is used to generate linear and angular momentum in a swimbot's body. This is the result of parts moving within the fluid. "
        + "<br>"
        + "<br>"
        + "Broad strokes that are perpendicular to the axis of the stroking part have the largest effect (they exert the greatest force). "
        + "<br>"
        + "<br>"
        + "Forces from part motions can sometimes cancel each other out. Therefore, coordinated motions of parts is required for efficient swimming. "
    }
    
    //--------------------------------
    else if ( page === 15 )
    {
        text
        = "<big><b>15. Perception</b></big> "
        + "<br> "
        + "<br> "
        + "Swimbots can see a full 360 degrees, but within a limited view distance. Swimbots can detect the direction of a food bit or a potential mate relative to its own orientation. This perception is used to determine how the swimbot turns. "
        + "<br> "
        + "<br> "
        + "Swimbots also can detect certain qualities in other swimbots such as sizes and colors of parts, motions of parts, and the spatial distributions of parts relative to each other. This is so that they can choose mates based on certain sexual preferences, such as 'long', 'hyper', 'big', etc. "
    }
    
    //--------------------------------
    else if ( page === 16 )
    {
        text
        = "<big><b>16. Turning</b></big>"
        + "<br>"
        + "<br>"
        + "If a swimbot has chosen a mate or a food bit as its goal the direction of that goal relative to its own orientation determines how it turns its body. This is an angular value. "
        + "<br>"
        + "<br>"
        + "But the exact manner in which a swimbot turns is completely up to genetic evolution. The only thing a swimbot knows is the direction of the goal, which triggers modulators in each part to alter the amplitudes and phases of its sine wave rotations. The kinds of modulations in each part are genetically determined. And you may notice that in the early stages of evolution, many swimbots are not able to turn correctly, and sometimes even swim away from their goal!"
    }
    
    //--------------------------------
    else if ( page === 17 )
    {
        text
        = "<big><b>17. Mate Choice</b></big>"
        + "<br>"
        + "<br>"
        + "When a swimbot is looking for a mate, it takes a 'snapshot' of every swimbot within its view, and then ranks these snapshots according to its criterion for beauty. It then chooses the most attractive one and begins to pursue it."
        + "<br>"
        + "<br>"
        + "Unlike pursuing food bits, in which the closest food bit is always the first choice, pursuing a chosen mate is a permanent decision, even if a more attractive swimbot wiggles by as it's pursuing its choice. You might be tempted to call this 'monogamy' - however, after mating, a swimbot could just as easily choose another mate which it finds more attractive. "
    }
    
    //--------------------------------
    else if ( page === 18 )
    {
        text
        = "<big><b>18. Attraction</b></big>"
        + "<br>"
        + "<br>"
        + "In sizing up a potential mate, a swimbot will normally look for body part colors that most match its own body part colors. For instance, a swimbot with mostly purple parts will be more attracted to a red swimbot with some purple in its body than a red swimbot with some green in its body. And a mostly-yellow swimbot would be considered quite ugly. "
        + "<br>"
        + "<br>"
        + "Alternate attraction criteria can be set by you, for experimental purposes. The complete list of attraction criteria are as follows: "
        + "<br>"
        + "<br>"
        + "similar color,    &nbsp&nbsp" 
        + "big,              &nbsp&nbsp" 
        + "hyper,            &nbsp&nbsp" 
        + "long,             &nbsp&nbsp" 
        + "straight,         &nbsp&nbsp" 
        + "opposite color,   &nbsp&nbsp" 
        + "small,            &nbsp&nbsp" 
        + "still,            &nbsp&nbsp" 
        + "short,            &nbsp&nbsp" 
        + "crooked,          &nbsp&nbsp" 
        + "closest,          &nbsp&nbsp" 
        + "random"
    }
    
    //--------------------------------
    else if ( page === 19 )
    {
        text
        = "<big><b>19. Reproduction</b></big>"
        + "<br>"
        + "<br>"
        + "When swimbots mate, they produce exactly one offspring, which appears in-between the parents. The offspring appears as a small white egg, and immediately begins to grow. When fully grown, it changes from white to fully-colored. "
        + "<br>"
        + "<br>"
        + "Genetic crossover occurs when an offspring is born, giving it alternating genetic building blocks from both parents. Random mutation can occur in some genes during mating. "
    }
    
    //--------------------------------
    else if ( page === 20 )
    {
        text
        = "<big><b>20. The Microscope</b></big>"
        + "<br>"
        + "<br>"
        + "The microscope controls can be found below. It has buttons for shifting the view up, down, left, or right. You can also zoom the view in or out. You may also use the keyboard (arrow keys shift the view, 'plus' and 'minus' keys zoom). "
        + "<br>"
        + "<br>"
        + "The View button provides some options such as viewing the whole pool, autotracking groups of swimbots, and watching certain 'mini-dramas' among swimbots. These mini-dramas may not make sense at first, but after the swimbots have evolved some, they become more meaningful, and are sometimes sad, sometimes amusing. "
    }
    
    //--------------------------------
    else if ( page === 21 )
    {
        text
        = "<big><b>21. Breeding</b></big>"
        + "<br>"
        + "<br>"
        + "You can encourage some isolated gene pools of similar swimbots) to survive by moving swimbots and food around, and helping them to mate. However, you cannot determine with whom a swimbot will fall in love - you cannot force two swimbots to mate if they don't already have the hots for each other. "
        + "<br>"
        + "<br>"
        + "If you interfere with nature too much, you may not be successful in breeding a good population. Reward the swimbots who show potential. For instance, go to the view menu and find the most prolific swimbot. If it is an obviously good swimmer, clone it and encourage it to mate with its twin. This might help it to propogate its genes without getting diluted by unrelated swimbots."
    }
    
    //--------------------------------
    else if ( page === 22 )
    {
        text
        = "<big><b>22. Cloning and Killing</b></big>"
        + "<br>"
        + "<br>"
        + "To clone or kill a swimbot, select it and then choose the 'Swimbot' button. There you will see the two options, along with information about that swimbot." 
        + "<br>"
        + "<br>"
        + "<br>"
        + "Remember: if you clone a swimbot, you will halve its energy - the other half of the energy will go to its new identical twin. Repeated cloning makes the swimbots hungry, so make sure there is some food nearby." 
        + "<br>"
        + "<br>"
        + "<br>"
        + "For quick cloning and killing, select the swimbot and hit the 'C' or 'K' key. "
    }
    
    //--------------------------------
    else if ( page === 23 )
    {
        text
        = "<big><b>23. Saving and Loading Pool Files</b></big>"
        + "<br>"
        + "<br>"
        + "This part of the interface is not fully-implemented yet."
    }
    
    //--------------------------------
    else if ( page === 24 )
    {
        text
        = "<big><b>24. Loading Swimbots into an Empty Pool</b></big>"
        + "<br>"
        + "<br>"
        + "If you have previously saved a swimbot, you can load it back into an empty pool to start a population from scratch, based on your saved swimbot."
        + "<br>"
        + "<br>"
        + "To start up an Empty Pool, go to the 'Pool' menu, and then choose 'Empty'. Then, you can go to the 'Swimbot' menu and load up a swimbot you had previously saved. If you clone that swimbot, there will now be two. (And you know it takes two to Tango)."
    }
    
    //--------------------------------
    else if ( page === 25 )
    {
        text
        = "<big><b>25. Tweaking Energy Settings</b></big>"
        + "<br>"
        + "<br>"
        + "To change food and energy parameters, go to the 'Tweak'menu. There are five parameters you can change."
        + "<br>"
        + "<br>"
        + "1. Food Growth Delay - how slow food is re-generated. "
        + "<br>"
        + "<br>"
        + "2. Food Growth Spread - how far the food spreads. "
        + "<br>"
        + "<br>"
        + "3. Food Bit Energy - the amount of energy in a food bit. "
        + "<br>"
        + "<br>"
        + "4. Swimbot Hunger Threshold - the energy level below which a swimbot becomes hungry."
        + "<br>"
        + "<br>"
        + "5. Swimbot Energy Offspring Ratio - the percentage of energy a parent gives to its offspring. "
    }
    
    //--------------------------------
    else if ( page === 26 )
    {
        text
        = "<big><b>26. Keyboard Controls</b></big>"
        + "<br>"
        + "<br>"
        + "minus: - &nbsp&nbsp&nbsp (zoom microscope out)"
        + "<br>"
        + "plus: + &nbsp&nbsp&nbsp (zoom microscope in) "
        + "<br>"
        + "arrow keys: &nbsp&nbsp&nbsp (move microscope) "
        + "<br>"
        
        /*
        <!--
        P: &nbsp&nbsp&nbsp (open Pool dialog) 
        <br>
        T: &nbsp&nbsp&nbsp (open Tweak dialog) 
        <br>
        S: &nbsp&nbsp&nbsp (open Swimbot dialog) 
        <br>
        I: &nbsp&nbsp&nbsp (open Info dialog) 
        <br>
        -->
        K: &nbsp&nbsp&nbsp (kill selected swimbot) 
        <br>
        C: &nbsp&nbsp&nbsp (clone selected swimbot) 
        <br>
        <!--esc key: &nbsp&nbsp&nbsp (close dialogs - normal view) -->
        */
    }
    
    //--------------------------------
    else if ( page === 27 )
    {
        text
        = "<big><b>27. Who made this thing?</b></big>"
        + "<br>"
        + "<br>"
        + "Gene Pool was created by <a href = 'http://www.ventrella.com/' target = '_blank' style = 'text-decoration:none'>Jeffrey Ventrella</a>."
        + "<br>"
        + "<br>"
        + "The following people have contributed ideas and technical help in the evolution of Gene Pool:"
        + "<br>"
        + "<br>"
        + "In alphabetical order:       "
        + "<br>"
        + "<br>"
        + "Brian Dodd, Bryan Galdrikian, Will Harvey, Jeremy Hussell, Mike Kaplan, Art Medlar, Luka Negoita, Ken Pearce, Scott Schafer, Julia Smith, Qarl Stiefvater, Barry Stump, TechnoZeus, Philip Ventrella, Frey Waid, Gary Walker"


        /*
        + "Brian Dodd,<br>"
        + "Bryan Galdrikian,<br>"
        + "Will Harvey,<br>"
        + "Jeremy Hussell,<br>"
        + "Mike Kaplan,<br>"
        + "Art Medlar,<br>"
        + "Ken Pearce,<br>"
        + "Scott Schafer,<br>"
        + "Julia Smith,<br>"
        + "Qarl Stiefvater,<br>"
        + "Barry Stump,<br>"
        + "TechnoZeus,<br>"
        + "Philip Ventrella,<br>"
        + "Frey Waid,<br>"
        + "Gary Walker"
        */
    }
    
    //--------------------------------
    else if ( page === 28 )
    {
        text = "(c) copyright 2021 Jeffrey Ventrella";
    }            
    
    return text;
}



// === js/ui.js ===
//--------------------------------------------------------------------------
//                                                                        
//    This file is part of GenePool Swimbots.                             
//    Copyright (c) 2021 by Jeffrey Ventrella - All Rights Reserved.      
//                                                                        
//    See the README file or go to swimbots.com for full license details.           
//    You may use, distribute, and modify this code only under the terms  
//    of the "Commons Clause" license (commonsclause.com).                
//                                                                        
//    This software is intended for education, game design, and research. 
//                                                                        
// -------------------------------------------------------------------------- 

"use strict";


//----------------------------
const FIRST_INFO_PAGE = 1;
const LAST_INFO_PAGE  = 28;

const DEFAULT_BASIC_PANEL_COLOR         = "#caccc2";
const DEFAULT_BASIC_BUTTON_COLOR        = "#dadad0";   
const DEFAULT_BASIC_BUTTON_BORDER_COLOR = "#7f7f77";   
const ACTIVE_BORDER_COLOR               = '#ffffff';   

const UI_UPDATE_PERIOD = 500;

let _currentInfoPage            = FIRST_INFO_PAGE;
let _graph                      = new Graph();
let _tweakGenesCategory         = 0;
let _runningFast                = false;

// Global simulation instance (used by inline HTML handlers)
var genePool;

//----------------------------
function setupNavigationButtons()
{
    const navButtons = [
        { id: "leftNav",  action: CameraNavigationAction.LEFT  },
        { id: "rightNav", action: CameraNavigationAction.RIGHT },
        { id: "upNav",    action: CameraNavigationAction.UP    },
        { id: "downNav",  action: CameraNavigationAction.DOWN  },
        { id: "inNav",    action: CameraNavigationAction.IN    },
        { id: "outNav",   action: CameraNavigationAction.OUT   }
    ];

    for (let i = 0; i < navButtons.length; i++)
    {
        let btn = document.getElementById(navButtons[i].id);
        if (!btn) continue;

        btn.addEventListener("mousedown", function()
        {
            genePool.startCameraNavigation(navButtons[i].action);
            clearViewModeButtons();
        });

        btn.addEventListener("mouseup", function()
        {
            genePool.stopCameraNavigation(navButtons[i].action);
        });

        btn.addEventListener("mouseleave", function()
        {
            genePool.stopCameraNavigation(navButtons[i].action);
        });
    }
}

//----------------------------
function initGenePool()
{
    genePool = new GenePool();
    genePool.initialize();
    genePool.setCanvas(canvas);
    genePool.setCanvasDimensions(canvasID.width, canvasID.height);
    setupNavigationButtons();
    initializeUI();
}

document.addEventListener("DOMContentLoaded", initGenePool);
window.addEventListener("resize", resize);


//----------------------------
function initializeUI()
{
    initializeEcosystemUI();    
    
    _graph.initialize();      
  
    //--------------------------------------------------
    // This starts an update loop that is called 
    // periodically to adjust UI states and stuff. 
    //--------------------------------------------------
    //console.log( "setTimeout" );
        
    setTimeout(updateUI, 1);
 }



//----------------------------
function chooseAttraction()
{
    //console.log( "chooseAttraction" );

    let radioButtons = document.getElementsByName( 'attractionRadioButton' );

    /*
    console.log( "radioButtons.length = " + radioButtons.length );

    for (let i = 0; i < radioButtons.length; i++) 
    {
        console.log( radioButtons[i].value );
    }
    */
    
    for (let i = 0; i < radioButtons.length; i++) 
    {
        if ( radioButtons[i].type === 'radio' ) 
        {
            //console.log( "if ( radioButtons[i].type === 'radio' ) " );

            if ( radioButtons[i].checked )
            {
                let value = radioButtons[i].value;  
                let attraction = ATTRACTION_SIMILAR_COLOR;

                     if ( value === "colorful"          ) { attraction = ATTRACTION_COLORFUL;           }
                else if ( value === "big"               ) { attraction = ATTRACTION_BIG;                }
                else if ( value === "hyper"             ) { attraction = ATTRACTION_HYPER;              }
                else if ( value === "long"              ) { attraction = ATTRACTION_LONG;               }
                else if ( value === "straight"          ) { attraction = ATTRACTION_STRAIGHT;           }
                
                else if ( value === "noColor"           ) { attraction = ATTRACTION_NO_COLOR;           }
                else if ( value === "small"             ) { attraction = ATTRACTION_SMALL;              }
                else if ( value === "still"             ) { attraction = ATTRACTION_STILL;              }
                else if ( value === "short"             ) { attraction = ATTRACTION_SHORT;              }
                else if ( value === "crooked"           ) { attraction = ATTRACTION_CROOKED;            }
                
                else if ( value === "similarColor"      ) { attraction = ATTRACTION_SIMILAR_COLOR;      }
                else if ( value === "similarSize"       ) { attraction = ATTRACTION_SIMILAR_SIZE;       }
                else if ( value === "similarHyper"      ) { attraction = ATTRACTION_SIMILAR_HYPER;      }
                 else if ( value === "similarLength"     ) { attraction = ATTRACTION_SIMILAR_LENGTH;     }
                else if ( value === "similarStraight"   ) { attraction = ATTRACTION_SIMILAR_STRAIGHT;   }
                
                else if ( value === "random"            ) { attraction = ATTRACTION_RANDOM;             }
                else if ( value === "closest"           ) { attraction = ATTRACTION_CLOSEST;            }
            
                //console.log ( "Attraction set to " + attraction );
                genePool.setAttraction( attraction );
            }
        }
    }
}


//-------------------------
function openTweakPanel()
{
    document.getElementById('tweakPanel' ).style.visibility = 'visible';		        

    document.getElementById( 'tweakDefaultButton' ).style.visibility = 'visible';
    updateEcosystemUI();
}    



//--------------------------------
function setEcosystemValue( id )
{
    let input = document.getElementById( id );
    
         if ( id === "foodGrowthDelaySlider"    ) { genePool.setFoodGrowthDelay     ( input.value ); }
    else if ( id === "foodSpreadSlider"         ) { genePool.setFoodSpread          ( input.value ); }
    else if ( id === "foodBitEnergySlider"      ) { genePool.setFoodBitEnergy       ( input.value ); }
    else if ( id === "hungerThresholdSlider"    ) { genePool.setHungerThreshold     ( input.value ); }
    else if ( id === "energyToOffspringSlider"  ) { genePool.setOffspringEnergyRatio( input.value ); }
    else if ( id === "maxAgeSlider"             ) { genePool.setMaximumSwimbotAge   ( input.value ); }
        
    updateEcosystemUI(); 
}

//------------------------------------
function setEcosystemToDefaults()
{   
    genePool.setFoodGrowthDelay     ( DEFAULT_FOOD_REGENERATION_PERIOD  );
    genePool.setFoodSpread          ( DEFAULT_FOOD_BIT_MAX_SPAWN_RADIUS );
    genePool.setFoodBitEnergy       ( DEFAULT_FOOD_BIT_ENERGY           );
    genePool.setHungerThreshold     ( DEFAULT_SWIMBOT_HUNGER_THRESHOLD  );
    genePool.setOffspringEnergyRatio( DEFAULT_CHILD_ENERGY_RATIO        );
    genePool.setMaximumSwimbotAge   ( DEFAULT_MAXIMUM_LIFESPAN          );
    
    updateEcosystemUI(); 
}



//----------------------------
function initializeEcosystemUI()
{
    document.getElementById( 'foodGrowthDelaySlider'    ).min = MIN_FOOD_REGENERATION_PERIOD;
    document.getElementById( 'foodGrowthDelaySlider'    ).max = MAX_FOOD_REGENERATION_PERIOD;

    document.getElementById( 'foodSpreadSlider'         ).min = MIN_FOOD_BIT_MAX_SPAWN_RADIUS;
    document.getElementById( 'foodSpreadSlider'         ).max = MAX_FOOD_BIT_MAX_SPAWN_RADIUS;

    document.getElementById( 'foodBitEnergySlider'      ).min = MIN_FOOD_BIT_ENERGY;
    document.getElementById( 'foodBitEnergySlider'      ).max = MAX_FOOD_BIT_ENERGY;
    
    document.getElementById( 'hungerThresholdSlider'    ).min = MIN_SWIMBOT_HUNGER_THRESHOLD;
    document.getElementById( 'hungerThresholdSlider'    ).max = MAX_SWIMBOT_HUNGER_THRESHOLD;
        
    document.getElementById( 'energyToOffspringSlider'  ).min = MIN_CHILD_ENERGY_RATIO;
    document.getElementById( 'energyToOffspringSlider'  ).max = MAX_CHILD_ENERGY_RATIO;
    
    document.getElementById( 'maxAgeSlider'             ).min = MIN_MAXIMUM_AGE;
    document.getElementById( 'maxAgeSlider'             ).max = MAX_MAXIMUM_AGE;
    
    updateEcosystemUI();
}
    


//----------------------------
function updateEcosystemUI()
{
    if ( typeof genePool != "undefined" ) 
    {    
        document.getElementById( "foodGrowthDelaySlider"    ).value     = genePool.getFoodGrowthDelay();
        document.getElementById( "foodGrowthDelayValue"     ).innerHTML = genePool.getFoodGrowthDelay();        
    
        document.getElementById( "foodSpreadSlider"         ).value     = genePool.getFoodSpread();
        document.getElementById( "foodSpreadValue"          ).innerHTML = genePool.getFoodSpread();

        document.getElementById( "foodBitEnergySlider"      ).value     = genePool.getFoodBitEnergy();
        document.getElementById( "foodBitEnergyValue"       ).innerHTML = genePool.getFoodBitEnergy();
    
        document.getElementById( "hungerThresholdSlider"    ).value     = genePool.getHungerThreshold();
        document.getElementById( "hungerThresholdValue"     ).innerHTML = genePool.getHungerThreshold();

        document.getElementById( "energyToOffspringSlider"  ).value     = genePool.getEnergyToOffspring();
        document.getElementById( "energyToOffspringValue"   ).innerHTML = genePool.getEnergyToOffspring();   

        document.getElementById( "maxAgeSlider"             ).value     = genePool.getMaximumSwimbotAge();
        document.getElementById( "maxAgeValue"              ).innerHTML = genePool.getMaximumSwimbotAge();   
        
    
        //--------------------------------------------------------------------------    
        // the radio buttons need to be reset to reflect any changes in attraction    
        //--------------------------------------------------------------------------    
        let radioButtons = document.getElementsByName( 'attractionRadioButton' );
        //console.log ( "updateEcosystemUI: genePool.getAttraction() = " + genePool.getAttraction() );
    
        for (let i = 0; i < radioButtons.length; i++) 
        {
            assert( i < NUM_ATTRACTIONS, "ui.js: updateEcosystemUI: i < NUM_ATTRACTIONS" );
        
            if ( radioButtons[i].type === 'radio' ) 
            {
                if ( genePool.getAttraction() === i )
                {
                    radioButtons[i].checked = true;
                }
                else
                {
                    radioButtons[i].checked = false;
                }
            }
        }
    } 
}




//----------------------------
function closeAllPanels()
{
    document.getElementById('poolPanel'    ).style.visibility = 'hidden';		        
    document.getElementById('swimbotPanel' ).style.visibility = 'hidden';		        
    document.getElementById('graphPanel'   ).style.visibility = 'hidden';		        
    document.getElementById('tweakPanel'   ).style.visibility = 'hidden';		        
    document.getElementById('infoPanel'    ).style.visibility = 'hidden';		        
    document.getElementById('infoText'     ).style.visibility = 'hidden';
    
    document.getElementById('prevInfoButton' ).style.visibility = 'hidden';	
    document.getElementById('nextInfoButton' ).style.visibility = 'hidden';	
    
    document.getElementById('noSelectedSwimbotPanel' ).style.visibility = 'hidden';	
    document.getElementById('selectedSwimbotPanel'   ).style.visibility = 'hidden';	

    document.getElementById('menuPoolButton'    ).style.top = 0;		        
    document.getElementById('menuSwimbotButton' ).style.top = 0;			        
    document.getElementById('menuTweakButton'   ).style.top = 0;			        
    document.getElementById('menuInfoButton'    ).style.top = 0;			        
    document.getElementById('menuGraphButton'   ).style.top = 0;	
    
    document.getElementById( 'menuPoolButton'    ).style = "border-bottom-width: 3; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;"
    document.getElementById( 'menuSwimbotButton' ).style = "border-bottom-width: 3; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;"
    document.getElementById( 'menuTweakButton'   ).style = "border-bottom-width: 3; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;"
    document.getElementById( 'menuInfoButton'    ).style = "border-bottom-width: 3; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;"
    document.getElementById( 'menuGraphButton'   ).style = "border-bottom-width: 3; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;"

    closePopupPanel();		        
                    
    _graph.clear();        	        
}


//----------------------------
function openPanel( buttonID )
{
    closeAllPanels(); 
    
    //console.log( "openPanel" );    
    //document.getElementById( buttonID ).style.visibility = 'hidden';
    
    let panelID = 'poolPanel';
            
    if ( buttonID === 'menuPoolButton'      ) { panelID = 'poolPanel';      openPoolPanel();    }
    if ( buttonID === 'menuSwimbotButton'   ) { panelID = 'swimbotPanel';   openSwimbotPanel(); }
    if ( buttonID === 'menuTweakButton'     ) { panelID = 'tweakPanel';     openTweakPanel();   }
    if ( buttonID === 'menuInfoButton'      ) { panelID = 'infoPanel';      openInfoPanel();    }
    if ( buttonID === 'menuGraphButton'     ) { panelID = 'graphPanel';     openGraphPanel()    }

    document.getElementById( buttonID ).style = "border-bottom-width: 0; border-bottom-left-radius: 0px; border-bottom-right-radius: 0px;"
    
    
    document.getElementById( buttonID ).style.backgroundColor = DEFAULT_BASIC_PANEL_COLOR;
    
    
    document.getElementById( buttonID ).style.top = 3;
}


//--------------------------
function openPoolPanel()
{
    document.getElementById( 'poolPanel' ).style.visibility = 'visible'; 
}

//--------------------------
function openGraphPanel()
{
    document.getElementById( 'graphPanel' ).style.visibility = 'visible'; 
}

//--------------------------
function openSwimbotPanel()
{
    //console.log( "openSwimbotPanel" );    

    document.getElementById('swimbotPanel' ).style.visibility = 'visible';		        
  
    if ( genePool.getASwimbotIsSelected() )
    {
        //console.log( "openSwimbotPanel ----SELECTED!" );
        document.getElementById( 'selectedSwimbotPanel'   ).style.visibility = 'visible';		        	        
        document.getElementById( 'noSelectedSwimbotPanel' ).style.visibility = 'hidden';
    }		    
    else
    {
        //console.log( "openSwimbotPanel ----NOT SELECTED!" );
        document.getElementById( 'selectedSwimbotPanel'   ).style.visibility = 'hidden';		        	        
        document.getElementById( 'noSelectedSwimbotPanel' ).style.visibility = 'visible';
    }		    
}    




//------------------------------------------------
function openTweakGenesPanel( selectedSwimbotID )
{
    if ( selectedSwimbotID != NULL_INDEX )
    {
        document.getElementById( 'tweakGenesPanel'      ).style.visibility = 'visible';		        	        
        document.getElementById( 'closeTweakGenesPanel' ).style.visibility = "visible"; 

        document.getElementById( 'tweakGenesPanel' ).innerHTML = "<div id = 'tweakGenesTitle' >Tweak the genes of swimbot " + selectedSwimbotID + "</div>"; 
        document.getElementById( 'tweakGenesPanel' ).innerHTML += "<div id = 'tweakGenesCategoryNote' >(choose which limb type to tweak)</div>"; 

        let numCategories = genePool.getNumGeneCategories();        
        for (let c=0; c<numCategories; c++)
        {
            document.getElementById( 'tweakGenesPanel' ).innerHTML            
            += "<div id = 'category" + (c+1) + "' >" + (c+1)
            +  "<input "
            +  "type         = 'radio' " 
            +  "id           = 'geneTweakerCategory" + c + "'"
            +  "name         = 'geneTweakerCategory'" 
            +  "oninput      = 'setGeneTweakCategory( " + selectedSwimbotID + ", " + c + ")' "
            +  "onchange     = 'setGeneTweakCategory( " + selectedSwimbotID + ", " + c + ")' "
            +  "></div>";
        }
        
        let num = genePool.getNumGenesPerCategory();
        num += 2; //add the two first (global: non-category) genes
        
        let width = 150;
        
        for (let g=0; g<num; g++)
        {
            let geneTweakerName  = genePool.getGeneName(g);
            let geneTweakerValue = genePool.getGeneValue( selectedSwimbotID, g );
            
            let top = 60 + g * 20;
            if ( g > 1 ) //skip the two first (global: non-category) genes
            {
                top += 80.0;
            }
            
            //----------------------------------------------------
            // construct the gene value display
            //----------------------------------------------------
            document.getElementById( 'tweakGenesPanel' ).innerHTML            
            += "<div class = 'geneTweakerValue' id = 'gene" + g + "Value' style = 'top:" + top + "px;'>" + geneTweakerValue + "</div>";

            //----------------------------------------------------
            // construct the slider
            //----------------------------------------------------
            document.getElementById( 'tweakGenesPanel' ).innerHTML            
            += "<input "
            +  "style        = 'top:" + ( top - 3 ) + "px; width:" + width + "px;'"
            +  "type         = 'range' " 
            +  "class        = 'geneTweakerSlider' "
            +  "min          = '0'"
            +  "max          = '255'"   
            +  "value        = '" + geneTweakerValue + "'"   
            +  "id           = 'geneTweaker" + g + "'"
            +  "name         = 'geneTweaker" 
            +  "step         = 1 "
            +  "autocomplete = 'off' "
            +  "oninput      = 'tweakGene( " + selectedSwimbotID + ", " + g + ")' "
            +  ">";
            
            //----------------------------------------------------
            // construct the gene name
            //----------------------------------------------------
            document.getElementById( 'tweakGenesPanel' ).innerHTML            
            += "<div class = 'geneTweakerName' style = 'top:" + top + "px;'>" + geneTweakerName + "</div>";
        }
        

        //----------------------------------------------------
        // initialize tweak category
        //----------------------------------------------------
        _tweakGenesCategory = 0;

        //----------------------------------------------------
        // set radio button check status
        //----------------------------------------------------
        let radioButtons = document.getElementsByName( 'geneTweakerCategory' );

        for (let i = 0; i < radioButtons.length; i++) 
        {
            if ( i === _tweakGenesCategory ) 
            {
                radioButtons[i].checked = true;
            }
            else
            {
                radioButtons[i].checked = false;
            }
        }    
    }
    else
    {
        document.getElementById( 'tweakGenesPanel'      ).style.visibility = 'hidden';		        	        
        document.getElementById( 'closeTweakGenesPanel' ).style.visibility = "hidden"; 
    }    
}


//----------------------------
function closeTweakGenesPanel()
{
    document.getElementById( 'tweakGenesPanel'      ).style.visibility = "hidden"; 
    document.getElementById( 'closeTweakGenesPanel' ).style.visibility = "hidden"; 
}


//---------------------------------------------
function updateGeneSliders( selectedSwimbotID )
{
    let num = genePool.getNumGenesPerCategory();
    num += 2; //add the two first (global: non-category) genes
    
    for (let g=0; g<num; g++)
    {
        let geneIndex = g;
    
        if ( g > 1 )
        {
            geneIndex += genePool.getNumGenesPerCategory() * _tweakGenesCategory;   
        }
    
        let geneTweakerValue = genePool.getGeneValue( selectedSwimbotID, geneIndex );
        
        let id = "geneTweaker" + g;
        let slider = document.getElementById( id );
        slider.value = geneTweakerValue;

        id = "gene" + g + "Value";
        document.getElementById( id ).innerHTML = geneTweakerValue;
    }
}


//-------------------------
function closePopupPanel()
{
    document.getElementById( 'popUpPanel'               ).style.visibility = 'hidden';
    document.getElementById( 'cancelPopUpPanelButton'   ).style.visibility = 'hidden';
    //document.getElementById( 'PopUpPanelError'          ).style.visibility = 'hidden';
    //document.getElementById( 'cancelErrorButton'        ).style.visibility = 'hidden';  
    //document.getElementById( 'popUpPanelInput'          ).style.visibility = 'hidden';
    //document.getElementById( 'savePopUpPanelButton'     ).style.visibility = 'hidden';
    //document.getElementById( 'noSavePopUpPanelButton'   ).style.visibility = 'hidden';
    document.getElementById( 'tweakDefaultButton'       ).style.visibility = 'hidden';
    //document.getElementById( 'submitFilenameButton'     ).style.visibility = 'hidden';
    document.getElementById( 'dataDisplayButton'        ).style.visibility = "hidden";
    
// I don't know why these are popping an error that they don't exist.... ??     
//document.getElementById( "PopupText"                ).style.visibility = "hidden";   
//document.getElementById( "loadedList"               ).style.visibility = "hidden";   
    
    //---------------------------------------------------------------------   
    // move focus to the canvas in case it had been on the popup input  
    //---------------------------------------------------------------------   
    document.getElementById( "Canvas" ).focus();     
}


//-------------------------
function closeAccountPanel()
{
    document.getElementById( 'cancelAccountPanelButton' ).style.visibility = "hidden";    
    document.getElementById( 'accountPanel'             ).style.visibility = "hidden";  
    document.getElementById( 'accountEmailInput'        ).style.visibility = "hidden";
    document.getElementById( 'accountPasswordInput'     ).style.visibility = "hidden";
    document.getElementById( 'submitAccountButton'      ).style.visibility = 'hidden';
    
    document.getElementById( 'accountButton'    ).style.visibility = "visible";      
    document.getElementById( 'loginButton'      ).style.visibility = "visible";      
}



//-------------------------
function closeErrorPanel()
{
    document.getElementById( 'PopUpPanelError'      ).style.visibility = "hidden";    
    document.getElementById( 'cancelErrorButton'    ).style.visibility = "hidden";    
}





//----------------------------------
function toggleSimulationRunning()
{
    if ( genePool.getSimulationRunning() )
    {
        genePool.setSimulationRunning( false ); 
        document.getElementById( "freezeButton" ).style.borderColor = ACTIVE_BORDER_COLOR;             
        document.getElementById( "freezeButton" ).style.borderWidth = "3px";   
    }
    else
    {
        genePool.setSimulationRunning( true ); 
        document.getElementById( "freezeButton" ).style = "border-color: " + DEFAULT_BASIC_BUTTON_BORDER_COLOR                
    }
}

//----------------------------------
function toggleFastRendering()
{
    if ( _runningFast )
    {
        _runningFast = false;
        genePool.setMillisecondsPerUpdate( 20 );
        document.getElementById( "fastButton" ).style = "border-color: " + DEFAULT_BASIC_BUTTON_BORDER_COLOR                
    }
    else
    {
        _runningFast = true;
        genePool.setMillisecondsPerUpdate(0);
        document.getElementById( "fastButton" ).style.borderColor       = ACTIVE_BORDER_COLOR;             
        document.getElementById( "fastButton" ).style.borderWidth =  "3px";   
    }
}


//-------------------------
function toggleRendering()
{
    if ( genePool.getRendering() )
    {
        setRendering( false );
    }
    else
    {
        setRendering( true ); 
    }
}

//-------------------------
function setRendering(r)
{
    if ( r )
    {
        genePool.setRendering( true ); 
        //document.getElementById( "noRenderButton" ).style = "border-color: " + DEFAULT_BASIC_BUTTON_BORDER_COLOR      
        //document.getElementById( "noRenderButton" ).style.zIndex = '4';                     
        //document.getElementById( "noRenderButton" ).style.zIndex = '1';     
        
        
                        
        canvasID.style.visibility = 'visible';
        document.getElementById( "noRenderPanel" ).style.visibility = 'hidden';

        /*
        _runningFast = false;
        genePool.setMillisecondsPerUpdate( 20 );
        document.getElementById( "fastButton" ).style = "border-color: #666659;"                
        */
    }
    else
    {
        genePool.setRendering( false ); 
        //document.getElementById( "noRenderButton" ).style = "border-color: " + ACTIVE_BORDER_COLOR + ";"                     
        //document.getElementById( "noRenderButton" ).style.borderWidth =  "3px";   

        //document.getElementById( "noRenderButton" ).style.content = 'fdf';       
                

        //document.getElementById( "noRenderButton" ).style.zIndex = '4';                     
        canvasID.style.visibility = 'hidden';
        document.getElementById( "noRenderPanel" ).style.visibility = 'visible';
        
        /*
        _runningFast = true;
        genePool.setMillisecondsPerUpdate(0);
        document.getElementById( "fastButton" ).style = "border-color: " + ACTIVE_BORDER_COLOR + ";"                
        */
    }
}


//---------------------------
function toggleGoalOverlay()
{
    genePool.toggleGoalOverlay();
    
    if ( genePool.getRenderingGoals() )
    {
        document.getElementById( "viewGoalButton" ).style = "border-color: " + ACTIVE_BORDER_COLOR    
        document.getElementById( "viewGoalButton" ).style.borderWidth = "3px";   
    }
    else
    {
        document.getElementById( "viewGoalButton" ).style = "border-color: " + DEFAULT_BASIC_BUTTON_BORDER_COLOR;  
        //document.getElementById( "viewGoalButton" ).style.borderWidth = "1px";   
        //document.getElementById( "viewGoalButton" ).style.borderBottomWidth = "4px";   
    }
}




//-------------------------------
function clearViewMode()
{
    //console.log( "ui.js: clearViewMode");

    genePool.clearViewMode();
    clearViewModeButtons();
}


//-------------------------------
function clearViewModeButtons()
{
    //console.log( "clearViewModeButtons");

    document.getElementById( 'viewWholePoolButton'  ).style.borderColor = DEFAULT_BASIC_BUTTON_BORDER_COLOR;  
    document.getElementById( 'viewAutoTrackButton'  ).style.borderColor = DEFAULT_BASIC_BUTTON_BORDER_COLOR; 
    document.getElementById( 'viewSelectedButton'   ).style.borderColor = DEFAULT_BASIC_BUTTON_BORDER_COLOR; 
    document.getElementById( 'viewMutualButton'     ).style.borderColor = DEFAULT_BASIC_BUTTON_BORDER_COLOR; 
    document.getElementById( 'viewProlificButton'   ).style.borderColor = DEFAULT_BASIC_BUTTON_BORDER_COLOR; 
    document.getElementById( 'viewEfficientButton'  ).style.borderColor = DEFAULT_BASIC_BUTTON_BORDER_COLOR; 
    document.getElementById( 'viewVirginButton'     ).style.borderColor = DEFAULT_BASIC_BUTTON_BORDER_COLOR; 
    document.getElementById( 'viewGluttonButton'    ).style.borderColor = DEFAULT_BASIC_BUTTON_BORDER_COLOR; 

    document.getElementById( 'viewWholePoolButton'  ).style.borderWidth = "1px";   
    document.getElementById( 'viewAutoTrackButton'  ).style.borderWidth = "1px";    
    document.getElementById( 'viewSelectedButton'   ).style.borderWidth = "1px";    
    document.getElementById( 'viewMutualButton'     ).style.borderWidth = "1px";    
    document.getElementById( 'viewProlificButton'   ).style.borderWidth = "1px";    
    document.getElementById( 'viewEfficientButton'  ).style.borderWidth = "1px";    
    document.getElementById( 'viewVirginButton'     ).style.borderWidth = "1px";    
    document.getElementById( 'viewGluttonButton'    ).style.borderWidth = "1px"; 

    document.getElementById( 'viewWholePoolButton'  ).style.borderBottomWidth = "4px";   
    document.getElementById( 'viewAutoTrackButton'  ).style.borderBottomWidth = "4px";    
    document.getElementById( 'viewSelectedButton'   ).style.borderBottomWidth = "4px";    
    document.getElementById( 'viewMutualButton'     ).style.borderBottomWidth = "4px";    
    document.getElementById( 'viewProlificButton'   ).style.borderBottomWidth = "4px";    
    document.getElementById( 'viewEfficientButton'  ).style.borderBottomWidth = "4px";    
    document.getElementById( 'viewVirginButton'     ).style.borderBottomWidth = "4px";    
    document.getElementById( 'viewGluttonButton'    ).style.borderBottomWidth = "4px"; 
    
    
}





//---------------------------------------
function setViewMode( buttonID, viewMode )
{
    //---------------------------
    // clear out the buttons...
    //---------------------------
    clearViewModeButtons();

    genePool.setViewMode( viewMode );
        
    closePopupPanel();		        

    if ( buttonID === 'viewSelectedButton' )
    {
        if ( genePool.getSelectedSwimbotID() != -1 )
        {
            document.getElementById( buttonID ).style = "border-color: " + ACTIVE_BORDER_COLOR    
            //document.getElementById( buttonID ).style.borderColor       = ACTIVE_BORDER_COLOR;             
            document.getElementById( buttonID ).style.borderWidth =  "3px";   
        }
    }
    else
    {
        document.getElementById( buttonID ).style = "border-color: " + ACTIVE_BORDER_COLOR    
        //document.getElementById( buttonID ).style.borderColor       = ACTIVE_BORDER_COLOR;             
        document.getElementById( buttonID ).style.borderWidth =  "3px";   
    }

}


//-------------------------------
function choosePoolToLoad( pool )
{
    _chosenPoolToLoad = pool;
}


//------------------------------------
function requestToLoadPoolFromFile()
{
    /*
    if ( _username === "anonymous" )
    {   
        showAccountRequiredPopup( "Cannot load pool" );
    }
    else
    {
        //----------------------------------------
        // get the name of the pool to load...
        //----------------------------------------
        let poolText = "from file";

        //-----------------------------------------------
        // make the appropriate UI elements visible...
        //-----------------------------------------------
        document.getElementById( 'popUpPanel'               ).style.visibility = "visible";   
        document.getElementById( 'cancelPopUpPanelButton'   ).style.visibility = "visible";
        document.getElementById( 'savePopUpPanelButton'     ).style.visibility = "visible";   
        document.getElementById( 'noSavePopUpPanelButton'   ).style.visibility = "visible";   

        //-----------------------------------------------
        // ask the question...
        //-----------------------------------------------
        document.getElementById( 'popUpPanel' ).innerHTML 
        = "<br>" 
        + "Do you want to save the current pool" 
        + "<br>" 
        + "before loading " + poolText + "?";
    }
    */
    
}



//--------------------------------------
function requestToLoadPoolFromPreset()
{

    //----------------------------------------
    // get the name of the pool to load...
    //----------------------------------------
    let poolText = "(ERROR)";

         if ( _chosenPoolToLoad === SimulationStartMode.RANDOM         ) { poolText = "'random'";        }     
    else if ( _chosenPoolToLoad === SimulationStartMode.NEIGHBORHOOD   ) { poolText = "'neighborhood'";  }
    else if ( _chosenPoolToLoad === SimulationStartMode.FROGGIES       ) { poolText = "'froggies'";      }
    else if ( _chosenPoolToLoad === SimulationStartMode.TANGO          ) { poolText = "'tango'";         }
    else if ( _chosenPoolToLoad === SimulationStartMode.RACE           ) { poolText = "'race'";          }
    else if ( _chosenPoolToLoad === SimulationStartMode.BIG_BANG       ) { poolText = "'big bang'";      }
    else if ( _chosenPoolToLoad === SimulationStartMode.BAD_PARENTS    ) { poolText = "'bad parents'";   }
    else if ( _chosenPoolToLoad === SimulationStartMode.EMPTY          ) { poolText = "'empty'";         }
    //else if ( _chosenPoolToLoad === SimulationStartMode.FILE           ) { poolText = "from file";       }
    
    //---------------------------------------------------------------------------------------
    // this overrides the UI asking the user to save the current pool first...
    //---------------------------------------------------------------------------------------
    switchToChosenPresetPool();
    

    /*
    //-----------------------------------------------
    // make the appropriate UI elements visible...
    //-----------------------------------------------
    document.getElementById( 'popUpPanel'               ).style.visibility = "visible";   
    document.getElementById( 'cancelPopUpPanelButton'   ).style.visibility = "visible";
    document.getElementById( 'savePopUpPanelButton'     ).style.visibility = "visible";   
    document.getElementById( 'noSavePopUpPanelButton'   ).style.visibility = "visible";   

    //-----------------------------------------------
    // ask the question...
    //-----------------------------------------------
    document.getElementById( 'popUpPanel' ).innerHTML 
    = "<br>" 
    + "Do you want to save the current pool" 
    + "<br>" 
    + "before loading " + poolText + "?";
    */
    
}



//----------------------------------
function switchToChosenPresetPool()
{
    //console.log( "switchToChosenPresetPool" );

    closePopupPanel();
    genePool.startSimulation( _chosenPoolToLoad ); 
    clearViewMode(); 
    updateEcosystemUI(); 
    _graph.initialize(); 
    setRendering( true );    
}


//--------------------------------
function loadSwimbotFromPreset(p)
{
    let genes = genePool.getPresetGenotype(p);
    genePool.createNewSwimbotWithGenes( genes );
}



//------------------------------------------------------
function setGeneTweakCategory( selectedSwimbotID, c )
{    
    _tweakGenesCategory = c;    
    updateGeneSliders( selectedSwimbotID );//
    //console.log( "_tweakGenesCategory = " + _tweakGenesCategory );
}


//---------------------------------------------
function tweakGene( swimbotIndex, sliderIndex )
{    
    let geneIndex = sliderIndex;
    
    if ( sliderIndex > 1 )
    {
        geneIndex += genePool.getNumGenesPerCategory() * _tweakGenesCategory;   
    }
    
    //-----------------------------------------
    // get the gene value...
    //-----------------------------------------
    //console.log( "geneIndex = " + geneIndex );

    let id = "geneTweaker" + sliderIndex;
 
    //console.log( id );
    
    let input = document.getElementById( id );

    let geneValue = input.value;

    //----------------------------------------------------------
    // update the gene value in the simulation...
    //----------------------------------------------------------
    genePool.tweakGene( swimbotIndex, geneIndex, geneValue );
        
    //----------------------------------------------------------
    // update the html that displays the value...
    //----------------------------------------------------------
    id = "gene" + sliderIndex + "Value";
    document.getElementById( id ).innerHTML = geneValue;
}


//----------------------------
function openInfoPanel()
{		    
    document.getElementById( 'infoPanel' ).style.visibility = 'visible'; 
    document.getElementById( 'infoText'  ).style.visibility = 'visible';
    
    //let the current page load up
    setInfoPage( _currentInfoPage );
}


//---------------------------------------
function advanceInfoPage( increment )
{		    
    _currentInfoPage += increment;    
    
    if ( _currentInfoPage < FIRST_INFO_PAGE )
    {
        _currentInfoPage = FIRST_INFO_PAGE;
    }

    if ( _currentInfoPage > LAST_INFO_PAGE )
    {
        _currentInfoPage = LAST_INFO_PAGE;
    }

    setInfoPage( _currentInfoPage );
}




//---------------------------------------------
function setInfoPage( pageNumber )
{
    document.getElementById( 'pageNumberLabel'  ).innerHTML = "page " + _currentInfoPage + " of 28";
    document.getElementById( "infoText"         ).innerHTML = getInfoText( _currentInfoPage );    

    if ( _currentInfoPage === FIRST_INFO_PAGE )
    {
        document.getElementById( 'prevInfoButton' ).style.visibility = 'hidden'
    }
    else
    {
        document.getElementById( 'prevInfoButton' ).style.visibility = 'visible'
    }

    if ( _currentInfoPage === LAST_INFO_PAGE )
    {
        document.getElementById( 'nextInfoButton' ).style.visibility = 'hidden'
    }
    else
    {
        document.getElementById( 'nextInfoButton' ).style.visibility = 'visible'
    }
}



//-----------------------
function updateUI()
{
    //console.log( "updateUI" );
    
    //-----------------------------------------------------------------------------------
    // check that we have a genePool......
    //-----------------------------------------------------------------------------------
    let genePoolIsDefined = typeof genePool != 'undefined';
    
    if ( genePoolIsDefined )
    {    
        //-----------------------------------------------------------------------------------
        // update the view buttons...
        //-----------------------------------------------------------------------------------
        //console.log( "ui.js: updateUI: genePool.getViewMode() = " + genePool.getViewMode() ); 
    
        if ( genePool.getViewMode() === ViewTrackingMode.NULL )
        {
            clearViewModeButtons();
        }
    
        //-----------------------------------------------------------------------------------
        // update the swimbot panel....
        //-----------------------------------------------------------------------------------
        if ( document.getElementById( 'swimbotPanel' ).style.visibility === 'visible' )
        {
        
//console.log( "OKAY OKAY OKAY OKAY " );        
        
            let selectedSwimbot = genePool.getSelectedSwimbotID();
        
            if ( selectedSwimbot === NULL_INDEX )
             {
                 document.getElementById( 'selectedSwimbotPanel'   ).style.visibility = 'hidden';
                document.getElementById( 'noSelectedSwimbotPanel' ).style.visibility = 'visible';	        	        
            }
            else
             {
                 document.getElementById( 'selectedSwimbotPanel'   ).style.visibility = 'visible';
                document.getElementById( 'noSelectedSwimbotPanel' ).style.visibility = 'hidden';	
            
                let brainState = genePool.getSwimbotBrainState( selectedSwimbot );
                let mateString = genePool.getSwimbotChosenMate( selectedSwimbot ).toString();
                let goalDescription = "";

                     if ( brainState ===  BRAIN_STATE_RESTING            ) { goalDescription = "resting";                       }
                else if ( brainState ===  BRAIN_STATE_LOOKING_FOR_MATE   ) { goalDescription = "looking for mate";              }
                else if ( brainState ===  BRAIN_STATE_PURSUING_MATE      ) { goalDescription = "pursuing mate " + mateString;   }
                else if ( brainState ===  BRAIN_STATE_LOOKING_FOR_FOOD   ) { goalDescription = "looking for food bit";          }
                else if ( brainState ===  BRAIN_STATE_PURSUING_FOOD      ) { goalDescription = "pursuing food bit";             }
                
                let foodPreferenceText = "green";
                let foodTypeText       = "green";

                if ( genePool.getSwimbotPreferredFoodType ( selectedSwimbot ) === 1 ) { foodPreferenceText = "blue"; }
                if ( genePool.getSwimbotDigestibleFoodType( selectedSwimbot ) === 1 ) { foodTypeText       = "blue"; }
            
                document.getElementById( 'swimbotDataPanel' ).innerHTML
                = "<b>Info about the selected swimbot:</b>"
                + "<br>"
                + "<br>"
                + "ID = " + genePool.getSwimbotIndex( selectedSwimbot ).toString()
                + "<br>"
                + "age = " + genePool.getSwimbotAge( selectedSwimbot ).toString()
                + "<br>"
                + "goal = " + goalDescription
                + "<br>"
                + "<br>"
                + "food type preference = " + foodPreferenceText
                + "<br>"
                + "best-digested food type = " + foodTypeText
                + "<br>"
                + "number of food bits eaten = " + Math.floor( genePool.getSwimbotNumFoodBitsEaten( selectedSwimbot ).toString() )
                + "<br>"
                + "energy = " + Math.floor( genePool.getSwimbotEnergy( selectedSwimbot ).toString() )
                + "<br>"
                + "<br>"
                + "sexual attraction = " + genePool.getSwimbotAttractionDescription( selectedSwimbot )
                + "<br>"
                + "number of offspring = " + Math.floor( genePool.getSwimbotNumOffspring( selectedSwimbot ).toString() );
            }              
        }

        //-----------------------------------------------------------------------------------
        // always update the graph....
        //-----------------------------------------------------------------------------------
        if ( genePoolIsDefined )
        {    
            //_graph.update( genePool.getTimeStep(), genePool.getNumSwimbots(), genePool.getNumFoodBits() );
            _graph.update( genePool.getTimeStep(), genePool.getNumSwimbots(), genePool.getNumFoodBits() , genePool.getNumFoodBits1() );
        }
    
        //-----------------------------------------------------------------------------------
        // render the graph....
        //-----------------------------------------------------------------------------------
        if ( document.getElementById( 'graphPanel' ).style.visibility === 'visible' )
        {
            document.getElementById( 'graphData' ).innerHTML
            = "time step: " + genePool.getTimeStep()
            + "<br>"
            + "swimbots: " + genePool.getNumSwimbots()
            + "<br>"
            + "food bits: " + genePool.getNumFoodBits()
            
            
            + "<br>"
            + "food bits 1: " + genePool.getNumFoodBits1();
            
            _graph.render();
        }
    }
    
    //---------------------------
    // trigger next update...
    //---------------------------
    //this.timer = setTimeout(updateUI, 100);
     setTimeout(updateUI, UI_UPDATE_PERIOD);
}	


//----------------------------------------
function notifyGeneTweakPanelMouseDown()
{ 
    let selectedSwimbotID = genePool.getSelectedSwimbotID();
    
    if ( selectedSwimbotID === -1 )
     {
         closeTweakGenesPanel();
    }
    else
    {
        if ( document.getElementById( 'tweakGenesPanel' ).style.visibility === 'visible' )
        {		        
             openTweakGenesPanel( selectedSwimbotID );
        }
    }
}



//----------------------
// under construction
//----------------------
function resize()
{ 
    let rightMargin = 400;

    // I can't get this to work...
    /*
    let masterPanel = document.getElementById( "masterPanel" );
    let masterPanelStyle = window.getComputedStyle( masterPanel, null );
    console.log( masterPanelStyle.width.toString() )      
    let rightMargin = masterPanelStyle.width;
    */

    let width  = window.innerWidth  - rightMargin;
    let height = window.innerHeight;
    
//if ( width  < rightMargin ) { width = rightMargin; }
    
    canvasID.width  = width;
    canvasID.height = height - 15;
    
///temp fix until I fix the simulation to take non-square proportions    
//canvasID.height = canvasID.width;    // make it square...

//canvasID.width = canvasID.height;
    
    let genePoolIsDefined = typeof genePool != 'undefined';
    if ( genePoolIsDefined )
    {    
        genePool.setCanvasDimensions( canvasID.width, canvasID.height );  
    }

    // this successfully places an image in the background, and I can use clearRect 
    // instead of fillrect in pool.render, but I don't yet know how to make the image scroll.
    
    /*
    canvasID.style.backgroundImage = "url( 'images/background.png' )";  
    canvasID.style.backgroundSize = canvasID.width + "px " + canvasID.height + "px";        
    canvasID.style.backgroundRepeat = "no-repeat";    
    */
    
}


//------------------------------------------------------------
document.getElementById( 'Canvas' ).onmousedown = function(e) 
{
    clearViewMode();

    if ( typeof genePool != "undefined" ) 
    {    
        genePool.touchDown( e.pageX - document.getElementById( 'Canvas' ).offsetLeft, e.pageY - document.getElementById( 'Canvas' ).offsetTop );  
    }
        
    notifyGeneTweakPanelMouseDown();
}

//------------------------------------------------------------
document.getElementById( 'Canvas' ).onmousemove = function(e) 
{
    if ( typeof genePool != "undefined" ) 
    {    
        genePool.touchMove( e.pageX - document.getElementById( 'Canvas' ).offsetLeft, e.pageY - document.getElementById( 'Canvas' ).offsetTop );
    }
}

//------------------------------------------------------------
document.getElementById( 'Canvas' ).onmouseup = function(e) 
{
    if ( typeof genePool != "undefined" ) 
    {    
        genePool.touchUp( e.pageX - document.getElementById( 'Canvas' ).offsetLeft, e.pageY - document.getElementById( 'Canvas' ).offsetTop );
    } 			
}

//------------------------------------------------------------
document.getElementById( 'Canvas' ).onmouseout = function(e) 
{
    if ( typeof genePool != "undefined" ) 
    {    
        genePool.touchOut( e.pageX - document.getElementById( 'Canvas' ).offsetLeft, e.pageY - document.getElementById( 'Canvas' ).offsetTop );
    } 			
}


/*
//-------------------------------------------------------------------
// This is a rather hacky way of getting a two-finger translational
// gesture (a 2D vector) to be used for scrolling and stuff
//-------------------------------------------------------------------
window.onwheel = function(e) 
{
    genePool.touchTwoFingerMove(e); 
    //e.preventDefault();
}
*/

//--------------------------------
// key down
//--------------------------------
document.onkeydown = function(e) 
{
    e = e || window.event;
    
    //-----------------------------
    // keys for camera navigation
    //-----------------------------
    let cameraNavAction = -1; 
    
    if ( e.keyCode ===  37 ) // left arrow key
    { 
        cameraNavAction = CameraNavigationAction.LEFT;    

//unfinished work - I'm trying to make it so that when a camera nav button is pressed on the keyboard, 
// the equivalent button highlights on the screen.
//document.getElementById( 'leftNav' ).style = 'background-image: url( "../../images/left-pressed.png" );'   
//document.getElementById( 'leftNav'    ).style = "border-bottom-width: 3; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;"
             
    } 
    
    if ( e.keyCode ===  39 ) { cameraNavAction = CameraNavigationAction.RIGHT;   } // right arrow key
    if ( e.keyCode ===  38 ) { cameraNavAction = CameraNavigationAction.UP;      } // up arrow key
    if ( e.keyCode ===  40 ) { cameraNavAction = CameraNavigationAction.DOWN;    } // down arrow key
    if ( e.keyCode ===  61 ) { cameraNavAction = CameraNavigationAction.IN;      } // plus key
    if ( e.keyCode === 173 ) { cameraNavAction = CameraNavigationAction.OUT;     } // minus key

    //apparently, Chrome and Safari  use different key codes...
    if ( e.keyCode === 187 ) { cameraNavAction = CameraNavigationAction.IN;      } // plus key
    if ( e.keyCode === 189 ) { cameraNavAction = CameraNavigationAction.OUT;     } // minus key
    
    if ( cameraNavAction != -1 )
    {
        if ( ! genePool.getCameraNavigationActive( cameraNavAction ) ) 
        { 
            genePool.startCameraNavigation( cameraNavAction );
            clearViewMode(); 
        }
    }
    
    //-----------------------------
    // other key pres events
    //-----------------------------
    /*
    if ( e.keyCode === 75 ) // K key
    { 
        let selectedSwimbot = genePool.getSelectedSwimbotID();
        if ( selectedSwimbot != -1 )
        {
            genePool.killSwimbot( selectedSwimbot ); 
        } 
    }
    if ( e.keyCode === 67 ) // C key
    { 
        let selectedSwimbot = genePool.getSelectedSwimbotID();
        if ( selectedSwimbot != -1 )
        {
            genePool.cloneSwimbot( selectedSwimbot ); 
        } 
    }
    */
    
                            
    //console.log( "onkeydown " + e.keyCode );
}

//------------------------------
document.onkeyup = function(e) 
{
    genePool.stopCameraNavigation( CameraNavigationAction.LEFT  );
    genePool.stopCameraNavigation( CameraNavigationAction.RIGHT );
    genePool.stopCameraNavigation( CameraNavigationAction.UP    );
    genePool.stopCameraNavigation( CameraNavigationAction.DOWN  );
    genePool.stopCameraNavigation( CameraNavigationAction.IN    );
    genePool.stopCameraNavigation( CameraNavigationAction.LEFT  );
    
/*
#leftNav
{
    left:   25; 
    top:    30;
    background-image: url( "../images/left.png" );
}
*/

    
};      

