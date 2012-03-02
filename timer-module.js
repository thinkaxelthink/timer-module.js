/* 
	timer-module.js
	Author: Axel Esquite
	Date: Fri November 11, 2011
	
	Usage:
	
	new timer({interval: 1000, direction: 'countdown', onInterval: towerCountdown, limit: _timeLimit, start: true});
	

	LICENSE (BSD):

	Copyright 2011 Axel Esquite, all rights reserved.

	Redistribution and use in source and binary forms, with or without
	modification, are permitted provided that the following conditions are met:

	  1. Redistributions of source code must retain the above copyright
	     notice, this list of conditions and the following disclaimer.

	  2. Redistributions in binary form must reproduce the above copyright
	     notice, this list of conditions and the following disclaimer in the
	     documentation and/or other materials provided with the distribution.

	  3. Neither the name of this module nor the names of its contributors may
	     be used to endorse or promote products derived from this software
	     without specific prior written permission.

	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
	"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
	LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
	A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
	OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
	SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
	OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/
define(function(){

	var timer = {
		_type: 'TIMER',
		_timeInterval: null,
		_intervalObj: null,
		_onIntervalCallback: null,
		_onIntervalEndCallback: null,
		_direction: null,
		_timeLimit: 0,
		init: function(args){
			this.self;
			if(typeof args !== 'undefined'
				&& args !== null)
			{
				if(args.hasOwnProperty('interval'))
				{
					this.timeInterval = args.interval;
				}

				if(args.hasOwnProperty('direction'))
				{
					this.direction = args.direction;
				}

				if(args.hasOwnProperty('onInterval'))
				{
					this.onIntervalCallback = args.onInterval;
				}

				if(args.hasOwnProperty('onIntervalEnd'))
				{
					this.onIntervalEndCallback = args.onIntervalEnd;
				}

				if(args.hasOwnProperty('limit'))
				{
					this.timeLimit = args.limit;
					this.timeUp    = args.limit;
				}

				if(args.hasOwnProperty('start') 
					&& args.start === true)
				{
					this.start();
				}
			}
		},
		onIntervalCountDown: function(){
			//log('onIntervalCountDown', this, _self);
			if(this.getCurrentTime('sec') <= 0)
			{
				this.stop();
				return;
			}

			this.timeLimit--;

			if(this.timeLimit<0)
			{
				this.timeLimit = 0;
			}

			if(typeof this.onIntervalCallback !== 'undefined'
				&& this.onIntervalCallback !== null)
			{
				this.onIntervalCallback();
			}

			this.start();
		},
		onIntervalCountUp: function(){
			if(this.getCurrentTime('sec') >= this.timeLimit)
			{
				this.stop();
			}

			if(this._timeLimit > this._timeUp)
			{
				this.timeLimit = this.timeUp;
			}
			else
			{
				this.timeLimit++;
			}

			if(typeof this.onIntervalCallback !== 'undefined'
				&& this.onIntervalCallback !== null)
			{
				this.onIntervalCallback();
			}
		},
		setTimeInterval: function(ms)
		{
			if(typeof ms !== 'undefined'
				&& typeof ms !== 'number'
				&& ms !== null)
			{
				this.timeout = ms;
			}
			else
			{
				throw this.constructor.name + '::Error required argument "milliseconds" is undefined';
			}
		},
		start: function()
		{
			//log('start', this);
			var self = this;
			if(typeof this.onIntervalCallback != undefined 
				&& this.onIntervalCallback != null)
			{
				switch(this.direction)
				{
					case 'countdown':
						//_intervalObj = setInterval(function(){ onIntervalCountDown() }, _timeInterval);
						this.timeout = setTimeout(function(){
							//log('on settimeout', this, self); 
							self.onIntervalCountDown(); 
						}, this.timeInterval);
						//log('start--countdown', this);
					break;

					case 'countup':
						this._timeLimit   = 0;
						this.timeout = setTimeout(function(){ self.onIntervalCountUp() }, this.timeInterval);
					break;

					case 'continuous':
						if(typeof _onIntervalCallback !== 'undefined'
							&& this.timeout !== null)
						{
							this.timeout = setTimeout(function(){ self.onIntervalCallback() }, this.timeInterval);
						}
					break;
				}
			}
			else
			{
				throw this.constructor.name + '::Error required "onInterval" was undefined and must be defined before starting Timer';
			}
		},
		stop: function()
		{
			if(typeof this.timeout != 'undefined')
			{
				clearTimeout(this.timeout);

				if(typeof this.onIntervalEndCallback !== 'undefined'
					&& this.onIntervalEndCallback !== null)
				{
					this.onIntervalEndCallback();
				}
			}
			else
			{
				throw this.constructor.name + '::Error required "interval" is null or undefined. Nothing can stop the timer!';
			}
		},
		getCurrentTime: function(format)
		{
			var t;
			var fsec;
			var min;
			var hrs;

			switch(format)
			{
				case 'HH:MM:SS':
					fsec = this.timeLimit % 60;
					t = two(fsec);
					min = Math.floor(this.timeLimit/60);

					t = two(min/60) + ':' + two(min % 60) + ':' + t;
					
				break;
				
				case 'MM:SS':
					fsec = this.timeLimit % 60;
					t = two(fsec);
					min = Math.floor(this.timeLimit/60);
					if(min>=60)
					{
						t = two(min/60) + ':' + two(min % 60) + ':' + t;
					}
					else
					{
						t = two(min) + ':' + t;
					}
				break;

				case 'sec':
					t = this.timeLimit;
				break;

				case 'min':

				break;

				case 'ms':

				break;
			}

			return t;
		},
		formatTimer: function(duration){
			var hours = _padDigits(Math.floor(duration / 3600), 2);
			var mins = _padDigits(Math.floor(duration / 60) - (hours *60), 2);
			var secs = _padDigits(Math.floor(duration - (hours * 3600 + mins * 60)), 2);
			return hours + ":" + mins + ":" + secs;
		}
	};
	
	function _padDigits(n, totalDigits) { 
        n = n.toString(); 
        var pd = ''; 
        if (totalDigits > n.length) { 
            for (i=0; i < (totalDigits-n.length); i++) { 
                pd += '0'; 
            } 
        } 
        return pd + n.toString(); 	
    }

	// 00:00:00, 00:00 formatters 
	// NOTE: does not return with : only does a 09 or 001
	function two(x) {return ((x>9)?"":"0")+Math.floor(x)}
	function three(x) {return ((x>99)?"":"0")+((x>9)?"":"0")+Math.floor(x)}
	
	return function(args){
		function F() {};
	    F.prototype = timer;
	    var f = new F();
	    f.init(args);
	    return f;
	};

});