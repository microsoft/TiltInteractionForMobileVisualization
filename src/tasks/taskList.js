var taskList = [
	// [  
	// 	{
	// 		"task_index": -3,
	// 		"x": "Energy Consumption",
	// 		"y": "GDP Per Capita",
	// 		"prompt": "Select the country that had the largest change in <span class='instruction_emphasis'>GDP Per Capita</span>.",
	// 		"num_responses": 1,
	// 		"correct_responses": ["Norway"],
	// 		"yearMin": 1980,
	// 		"yearMax": 2000,
	// 		"tutorial": true,
	// 		"quality_control": false
	// 	},
	// 	{
	// 		"task_index": -2,
	// 		"x": "Number of Personal Computers",
	// 		"y": "GDP Per Capita",
	// 		"prompt": "Select <span class='instruction_number'>three</span> countries with rapid growth in the <span class='instruction_emphasis'>Number of Personal Computers</span> between 1985 and 2000.",
	// 		"num_responses": 3,
	// 		"correct_responses": ["Denmark","Iceland","Norway","Sweden","United States","Australia"],
	// 		"yearMin": 1985,
	// 		"yearMax": 2000,
	// 		"tutorial": true,
	// 		"quality_control": false
	// 	},
	// 	{
	// 		"task_index": -1,
	// 		"x": "Number of Personal Computers",
	// 		"y": "Life Expectancy",
	// 		"prompt": "Select <span class='instruction_number'>one</span> foo country with little growth in the <span class='instruction_emphasis'>Number of Personal Computers</span>.",
	// 		"num_responses": 1,
	// 		"correct_responses": ["Hungary"],
	// 		"yearMin": 1985,
	// 		"yearMax": 2000,
	// 		"tutorial": true,
	// 		"quality_control": false
	// 	},
	// 	{
	// 		"task_index": 0,
	// 		"x": "Population",
	// 		"y": "GDP Per Capita",
	// 		"prompt": "Select the <span class='instruction_number'>two</span> countries having the largest <span class='instruction_emphasis'>Population</span> in the year 2000.",
	// 		"num_responses": 2,
	// 		"correct_responses": ["India","China"],
	// 		"yearMin": 1975,
	// 		"yearMax": 2000,
	// 		"tutorial": false,
	// 		"quality_control": true
	// 	},
	// 	{
	// 		"task_index": 1,
	// 		"x": "Indexed Energy Consumption",
	// 		"y": "Indexed GDP",
	// 		"prompt": "Select <span class='instruction_number'>two</span> countries whose <span class='instruction_emphasis'>Indexed Energy Consumption</span> grew faster than their <span class='instruction_emphasis'>Indexed GDP</span>.",
	// 		"num_responses": 2,
	// 		"correct_responses": ["India","China"],
	// 		"yearMin": 1975,
	// 		"yearMax": 2000,
	// 		"tutorial": false,
	// 		"quality_control": false
	// 	},
	// 	{
	// 		"task_index": 2,
	// 		"x": "Energy Consumption",
	// 		"y": "GDP Per Capita",
	// 		"prompt": "Select <span class='instruction_number'>three</span> countries that had little change in <span class='instruction_emphasis'>GDP Per Capita</span>.",
	// 		"num_responses": 3,
	// 		"correct_responses": ["Gambia","Liberia","Rwanda"],
	// 		"yearMin": 1975,
	// 		"yearMax": 2000,
	// 		"tutorial": false,
	// 		"quality_control": false
	// 	},	
	// 	{
	// 		"task_index": 3,
	// 		"x": "Life Expectancy",
	// 		"y": "Infant Mortality",
	// 		"prompt": "Select <span class='instruction_number'>one</span> country with a decreasing <span class='instruction_emphasis'>Infant Mortality</span> rate, but little change in <span class='instruction_emphasis'>Life Expectancy</span>.",
	// 		"num_responses": 1,
	// 		"correct_responses": ["Hungary"],
	// 		"yearMin": 1975,
	// 		"yearMax": 2000,
	// 		"tutorial": false,
	// 		"quality_control": false
	// 	},
	// 	{
	// 		"task_index": 4,
	// 		"x": "Life Expectancy",
	// 		"y": "Infant Mortality",
	// 		"prompt": "Select <span class='instruction_number'>two</span> countries whose <span class='instruction_emphasis'>Infant Mortality</span> rate decreased first, then increased later.",
	// 		"num_responses": 2,
	// 		"correct_responses": ["Liberia","Rwanda"],
	// 		"yearMin": 1975,
	// 		"yearMax": 2000,
	// 		"tutorial": false,
	// 		"quality_control": false
	// 	},
	// 	{
	// 		"task_index": 5,
	// 		"x": "Life Expectancy",
	// 		"y": "Infant Mortality",
	// 		"prompt": "Select <span class='instruction_number'>two</span> countries whose <span class='instruction_emphasis'>Infant Mortality</span> rate decreased the most.",
	// 		"num_responses": 2,
	// 		"correct_responses": ["Gambia","Saudi Arabia"],
	// 		"yearMin": 1975,
	// 		"yearMax": 2000,
	// 		"tutorial": false,
	// 		"quality_control": false
	// 	},
	// 	{
	// 		"task_index": 6,
	// 		"x": "Indexed Energy Consumption",
	// 		"y": "Indexed Population",
	// 		"prompt": "Select <span class='instruction_number'>two</span> countries whose <span class='instruction_emphasis'>Indexed Population</span> grew faster than their <span class='instruction_emphasis'>Indexed Energy Consumption</span>.",
	// 		"num_responses": 2,
	// 		"correct_responses": ["India","China"],
	// 		"yearMin": 1975,
	// 		"yearMax": 2000,
	// 		"tutorial": false,
	// 		"quality_control": false
	// 	},
	// 	{
	// 		"task_index": 7,
	// 		"x": "Life Expectancy (Women)",
	// 		"y": "Life Expectancy (Men)",
	// 		"prompt": "Select <span class='instruction_number'>one</span> country where <span class='instruction_emphasis'>Life Expectancy</span> (<span class='instruction_emphasis'>Women</span> & <span class='instruction_emphasis'>Men</span>) increased first and decreased later.",
	// 		"num_responses": 1,
	// 		"correct_responses": ["Liberia","Rwanda"],
	// 		"yearMin": 1975,
	// 		"yearMax": 2000,
	// 		"tutorial": false,
	// 		"quality_control": false
	// 	},
	// 	{
	// 		"task_index": 8,
	// 		"x": "Arable Area",
	// 		"y": "Population",
	// 		"prompt": "Select <span class='instruction_number'>one</span> country that had a decrease in <span class='instruction_emphasis'>Arable Area</span>, even as their <span class='instruction_emphasis'>Population</span> increased.",
	// 		"num_responses": 1,
	// 		"correct_responses": ["United States"],
	// 		"yearMin": 1975,
	// 		"yearMax": 2000,
	// 		"tutorial": false,
	// 		"quality_control": false
	// 	},
	// 	{
	// 		"task_index": 9,
	// 		"x": "Arable Area",
	// 		"y": "Population",
	// 		"prompt": "Select <span class='instruction_number'>one</span> country that had an increase in <span class='instruction_emphasis'>Arable Area</span>, but only a slight increase in <span class='instruction_emphasis'>Population</span>.",
	// 		"num_responses": 1,
	// 		"correct_responses": ["Australia"],
	// 		"yearMin": 1975,
	// 		"yearMax": 2000,
	// 		"tutorial": false,
	// 		"quality_control": false
	// 	}
	// ],
	[
		{
			"task_index": -3,
			"x": "Energy Consumption",
			"y": "GDP Per Capita",
			"prompt": "Select the country that had the largest change in <span class='instruction_emphasis'>GDP Per Capita</span>.",
			"num_responses": 1,
			"correct_responses": [
				"Norway"
			],
			"yearMin": 1980,
			"yearMax": 2000,
			"tutorial": true,
			"quality_control": false
		},
		{
			"task_index": -2,
			"x": "Number of Personal Computers",
			"y": "GDP Per Capita",
			"prompt": "Select <span class='instruction_number'>three</span> countries with rapid growth in the <span class='instruction_emphasis'>Number of Personal Computers</span> between 1985 and 2000.",
			"num_responses": 3,
			"correct_responses": [
				"Denmark",
				"Iceland",
				"Norway",
				"Sweden",
				"United States",
				"Australia"
			],
			"yearMin": 1985,
			"yearMax": 2000,
			"tutorial": true,
			"quality_control": false
		},
		{
			"task_index": -1,
			"x": "Number of Personal Computers",
			"y": "Life Expectancy",
			"prompt": "Select <span class='instruction_number'>one</span> foo country with little growth in the <span class='instruction_emphasis'>Number of Personal Computers</span>.",
			"num_responses": 1,
			"correct_responses": [
				"Hungary"
			],
			"yearMin": 1985,
			"yearMax": 2000,
			"tutorial": true,
			"quality_control": false
		},
		{
			"task_index": 1,
			"x": "Indexed Energy Consumption",
			"y": "Indexed GDP",
			"prompt": "Select <span class='instruction_number'>two</span> countries whose <span class='instruction_emphasis'>Indexed Energy Consumption</span> grew faster than their <span class='instruction_emphasis'>Indexed GDP</span>.",
			"num_responses": 2,
			"correct_responses": [
				"India",
				"China"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 0,
			"x": "Population",
			"y": "GDP Per Capita",
			"prompt": "Select the <span class='instruction_number'>two</span> countries having the largest <span class='instruction_emphasis'>Population</span> in the year 2000.",
			"num_responses": 2,
			"correct_responses": [
				"India",
				"China"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": true
		},
		{
			"task_index": 3,
			"x": "Life Expectancy",
			"y": "Infant Mortality",
			"prompt": "Select <span class='instruction_number'>one</span> country with a decreasing <span class='instruction_emphasis'>Infant Mortality</span> rate, but little change in <span class='instruction_emphasis'>Life Expectancy</span>.",
			"num_responses": 1,
			"correct_responses": [
				"Hungary"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 9,
			"x": "Arable Area",
			"y": "Population",
			"prompt": "Select <span class='instruction_number'>one</span> country that had an increase in <span class='instruction_emphasis'>Arable Area</span>, but only a slight increase in <span class='instruction_emphasis'>Population</span>.",
			"num_responses": 1,
			"correct_responses": [
				"Australia"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 4,
			"x": "Life Expectancy",
			"y": "Infant Mortality",
			"prompt": "Select <span class='instruction_number'>two</span> countries whose <span class='instruction_emphasis'>Infant Mortality</span> rate decreased first, then increased later.",
			"num_responses": 2,
			"correct_responses": [
				"Liberia",
				"Rwanda"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 8,
			"x": "Arable Area",
			"y": "Population",
			"prompt": "Select <span class='instruction_number'>one</span> country that had a decrease in <span class='instruction_emphasis'>Arable Area</span>, even as their <span class='instruction_emphasis'>Population</span> increased.",
			"num_responses": 1,
			"correct_responses": [
				"United States"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 2,
			"x": "Energy Consumption",
			"y": "GDP Per Capita",
			"prompt": "Select <span class='instruction_number'>three</span> countries that had little change in <span class='instruction_emphasis'>GDP Per Capita</span>.",
			"num_responses": 3,
			"correct_responses": [
				"Gambia",
				"Liberia",
				"Rwanda"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 7,
			"x": "Life Expectancy (Women)",
			"y": "Life Expectancy (Men)",
			"prompt": "Select <span class='instruction_number'>one</span> country where <span class='instruction_emphasis'>Life Expectancy</span> (<span class='instruction_emphasis'>Women</span> & <span class='instruction_emphasis'>Men</span>) increased first and decreased later.",
			"num_responses": 1,
			"correct_responses": [
				"Liberia",
				"Rwanda"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 5,
			"x": "Life Expectancy",
			"y": "Infant Mortality",
			"prompt": "Select <span class='instruction_number'>two</span> countries whose <span class='instruction_emphasis'>Infant Mortality</span> rate decreased the most.",
			"num_responses": 2,
			"correct_responses": [
				"Gambia",
				"Saudi Arabia"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 6,
			"x": "Indexed Energy Consumption",
			"y": "Indexed Population",
			"prompt": "Select <span class='instruction_number'>two</span> countries whose <span class='instruction_emphasis'>Indexed Population</span> grew faster than their <span class='instruction_emphasis'>Indexed Energy Consumption</span>.",
			"num_responses": 2,
			"correct_responses": [
				"India",
				"China"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		}
	],
	[
		{
			"task_index": -3,
			"x": "Energy Consumption",
			"y": "GDP Per Capita",
			"prompt": "Select the country that had the largest change in <span class='instruction_emphasis'>GDP Per Capita</span>.",
			"num_responses": 1,
			"correct_responses": [
				"Norway"
			],
			"yearMin": 1980,
			"yearMax": 2000,
			"tutorial": true,
			"quality_control": false
		},
		{
			"task_index": -2,
			"x": "Number of Personal Computers",
			"y": "GDP Per Capita",
			"prompt": "Select <span class='instruction_number'>three</span> countries with rapid growth in the <span class='instruction_emphasis'>Number of Personal Computers</span> between 1985 and 2000.",
			"num_responses": 3,
			"correct_responses": [
				"Denmark",
				"Iceland",
				"Norway",
				"Sweden",
				"United States",
				"Australia"
			],
			"yearMin": 1985,
			"yearMax": 2000,
			"tutorial": true,
			"quality_control": false
		},
		{
			"task_index": -1,
			"x": "Number of Personal Computers",
			"y": "Life Expectancy",
			"prompt": "Select <span class='instruction_number'>one</span> foo country with little growth in the <span class='instruction_emphasis'>Number of Personal Computers</span>.",
			"num_responses": 1,
			"correct_responses": [
				"Hungary"
			],
			"yearMin": 1985,
			"yearMax": 2000,
			"tutorial": true,
			"quality_control": false
		},
		{
			"task_index": 3,
			"x": "Life Expectancy",
			"y": "Infant Mortality",
			"prompt": "Select <span class='instruction_number'>one</span> country with a decreasing <span class='instruction_emphasis'>Infant Mortality</span> rate, but little change in <span class='instruction_emphasis'>Life Expectancy</span>.",
			"num_responses": 1,
			"correct_responses": [
				"Hungary"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 6,
			"x": "Indexed Energy Consumption",
			"y": "Indexed Population",
			"prompt": "Select <span class='instruction_number'>two</span> countries whose <span class='instruction_emphasis'>Indexed Population</span> grew faster than their <span class='instruction_emphasis'>Indexed Energy Consumption</span>.",
			"num_responses": 2,
			"correct_responses": [
				"India",
				"China"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 4,
			"x": "Life Expectancy",
			"y": "Infant Mortality",
			"prompt": "Select <span class='instruction_number'>two</span> countries whose <span class='instruction_emphasis'>Infant Mortality</span> rate decreased first, then increased later.",
			"num_responses": 2,
			"correct_responses": [
				"Liberia",
				"Rwanda"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 9,
			"x": "Arable Area",
			"y": "Population",
			"prompt": "Select <span class='instruction_number'>one</span> country that had an increase in <span class='instruction_emphasis'>Arable Area</span>, but only a slight increase in <span class='instruction_emphasis'>Population</span>.",
			"num_responses": 1,
			"correct_responses": [
				"Australia"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 2,
			"x": "Energy Consumption",
			"y": "GDP Per Capita",
			"prompt": "Select <span class='instruction_number'>three</span> countries that had little change in <span class='instruction_emphasis'>GDP Per Capita</span>.",
			"num_responses": 3,
			"correct_responses": [
				"Gambia",
				"Liberia",
				"Rwanda"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 8,
			"x": "Arable Area",
			"y": "Population",
			"prompt": "Select <span class='instruction_number'>one</span> country that had a decrease in <span class='instruction_emphasis'>Arable Area</span>, even as their <span class='instruction_emphasis'>Population</span> increased.",
			"num_responses": 1,
			"correct_responses": [
				"United States"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 7,
			"x": "Life Expectancy (Women)",
			"y": "Life Expectancy (Men)",
			"prompt": "Select <span class='instruction_number'>one</span> country where <span class='instruction_emphasis'>Life Expectancy</span> (<span class='instruction_emphasis'>Women</span> & <span class='instruction_emphasis'>Men</span>) increased first and decreased later.",
			"num_responses": 1,
			"correct_responses": [
				"Liberia",
				"Rwanda"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 0,
			"x": "Population",
			"y": "GDP Per Capita",
			"prompt": "Select the <span class='instruction_number'>two</span> countries having the largest <span class='instruction_emphasis'>Population</span> in the year 2000.",
			"num_responses": 2,
			"correct_responses": [
				"India",
				"China"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": true
		},
		{
			"task_index": 5,
			"x": "Life Expectancy",
			"y": "Infant Mortality",
			"prompt": "Select <span class='instruction_number'>two</span> countries whose <span class='instruction_emphasis'>Infant Mortality</span> rate decreased the most.",
			"num_responses": 2,
			"correct_responses": [
				"Gambia",
				"Saudi Arabia"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 1,
			"x": "Indexed Energy Consumption",
			"y": "Indexed GDP",
			"prompt": "Select <span class='instruction_number'>two</span> countries whose <span class='instruction_emphasis'>Indexed Energy Consumption</span> grew faster than their <span class='instruction_emphasis'>Indexed GDP</span>.",
			"num_responses": 2,
			"correct_responses": [
				"India",
				"China"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		}
	],
	[
		{
			"task_index": -3,
			"x": "Energy Consumption",
			"y": "GDP Per Capita",
			"prompt": "Select the country that had the largest change in <span class='instruction_emphasis'>GDP Per Capita</span>.",
			"num_responses": 1,
			"correct_responses": [
				"Norway"
			],
			"yearMin": 1980,
			"yearMax": 2000,
			"tutorial": true,
			"quality_control": false
		},
		{
			"task_index": -2,
			"x": "Number of Personal Computers",
			"y": "GDP Per Capita",
			"prompt": "Select <span class='instruction_number'>three</span> countries with rapid growth in the <span class='instruction_emphasis'>Number of Personal Computers</span> between 1985 and 2000.",
			"num_responses": 3,
			"correct_responses": [
				"Denmark",
				"Iceland",
				"Norway",
				"Sweden",
				"United States",
				"Australia"
			],
			"yearMin": 1985,
			"yearMax": 2000,
			"tutorial": true,
			"quality_control": false
		},
		{
			"task_index": -1,
			"x": "Number of Personal Computers",
			"y": "Life Expectancy",
			"prompt": "Select <span class='instruction_number'>one</span> foo country with little growth in the <span class='instruction_emphasis'>Number of Personal Computers</span>.",
			"num_responses": 1,
			"correct_responses": [
				"Hungary"
			],
			"yearMin": 1985,
			"yearMax": 2000,
			"tutorial": true,
			"quality_control": false
		},
		{
			"task_index": 4,
			"x": "Life Expectancy",
			"y": "Infant Mortality",
			"prompt": "Select <span class='instruction_number'>two</span> countries whose <span class='instruction_emphasis'>Infant Mortality</span> rate decreased first, then increased later.",
			"num_responses": 2,
			"correct_responses": [
				"Liberia",
				"Rwanda"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 1,
			"x": "Indexed Energy Consumption",
			"y": "Indexed GDP",
			"prompt": "Select <span class='instruction_number'>two</span> countries whose <span class='instruction_emphasis'>Indexed Energy Consumption</span> grew faster than their <span class='instruction_emphasis'>Indexed GDP</span>.",
			"num_responses": 2,
			"correct_responses": [
				"India",
				"China"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 5,
			"x": "Life Expectancy",
			"y": "Infant Mortality",
			"prompt": "Select <span class='instruction_number'>two</span> countries whose <span class='instruction_emphasis'>Infant Mortality</span> rate decreased the most.",
			"num_responses": 2,
			"correct_responses": [
				"Gambia",
				"Saudi Arabia"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 9,
			"x": "Arable Area",
			"y": "Population",
			"prompt": "Select <span class='instruction_number'>one</span> country that had an increase in <span class='instruction_emphasis'>Arable Area</span>, but only a slight increase in <span class='instruction_emphasis'>Population</span>.",
			"num_responses": 1,
			"correct_responses": [
				"Australia"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 3,
			"x": "Life Expectancy",
			"y": "Infant Mortality",
			"prompt": "Select <span class='instruction_number'>one</span> country with a decreasing <span class='instruction_emphasis'>Infant Mortality</span> rate, but little change in <span class='instruction_emphasis'>Life Expectancy</span>.",
			"num_responses": 1,
			"correct_responses": [
				"Hungary"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 0,
			"x": "Population",
			"y": "GDP Per Capita",
			"prompt": "Select the <span class='instruction_number'>two</span> countries having the largest <span class='instruction_emphasis'>Population</span> in the year 2000.",
			"num_responses": 2,
			"correct_responses": [
				"India",
				"China"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": true
		},
		{
			"task_index": 7,
			"x": "Life Expectancy (Women)",
			"y": "Life Expectancy (Men)",
			"prompt": "Select <span class='instruction_number'>one</span> country where <span class='instruction_emphasis'>Life Expectancy</span> (<span class='instruction_emphasis'>Women</span> & <span class='instruction_emphasis'>Men</span>) increased first and decreased later.",
			"num_responses": 1,
			"correct_responses": [
				"Liberia",
				"Rwanda"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 2,
			"x": "Energy Consumption",
			"y": "GDP Per Capita",
			"prompt": "Select <span class='instruction_number'>three</span> countries that had little change in <span class='instruction_emphasis'>GDP Per Capita</span>.",
			"num_responses": 3,
			"correct_responses": [
				"Gambia",
				"Liberia",
				"Rwanda"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 8,
			"x": "Arable Area",
			"y": "Population",
			"prompt": "Select <span class='instruction_number'>one</span> country that had a decrease in <span class='instruction_emphasis'>Arable Area</span>, even as their <span class='instruction_emphasis'>Population</span> increased.",
			"num_responses": 1,
			"correct_responses": [
				"United States"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 6,
			"x": "Indexed Energy Consumption",
			"y": "Indexed Population",
			"prompt": "Select <span class='instruction_number'>two</span> countries whose <span class='instruction_emphasis'>Indexed Population</span> grew faster than their <span class='instruction_emphasis'>Indexed Energy Consumption</span>.",
			"num_responses": 2,
			"correct_responses": [
				"India",
				"China"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		}
	],
	[
		{
			"task_index": -3,
			"x": "Energy Consumption",
			"y": "GDP Per Capita",
			"prompt": "Select the country that had the largest change in <span class='instruction_emphasis'>GDP Per Capita</span>.",
			"num_responses": 1,
			"correct_responses": [
				"Norway"
			],
			"yearMin": 1980,
			"yearMax": 2000,
			"tutorial": true,
			"quality_control": false
		},
		{
			"task_index": -2,
			"x": "Number of Personal Computers",
			"y": "GDP Per Capita",
			"prompt": "Select <span class='instruction_number'>three</span> countries with rapid growth in the <span class='instruction_emphasis'>Number of Personal Computers</span> between 1985 and 2000.",
			"num_responses": 3,
			"correct_responses": [
				"Denmark",
				"Iceland",
				"Norway",
				"Sweden",
				"United States",
				"Australia"
			],
			"yearMin": 1985,
			"yearMax": 2000,
			"tutorial": true,
			"quality_control": false
		},
		{
			"task_index": -1,
			"x": "Number of Personal Computers",
			"y": "Life Expectancy",
			"prompt": "Select <span class='instruction_number'>one</span> foo country with little growth in the <span class='instruction_emphasis'>Number of Personal Computers</span>.",
			"num_responses": 1,
			"correct_responses": [
				"Hungary"
			],
			"yearMin": 1985,
			"yearMax": 2000,
			"tutorial": true,
			"quality_control": false
		},
		{
			"task_index": 6,
			"x": "Indexed Energy Consumption",
			"y": "Indexed Population",
			"prompt": "Select <span class='instruction_number'>two</span> countries whose <span class='instruction_emphasis'>Indexed Population</span> grew faster than their <span class='instruction_emphasis'>Indexed Energy Consumption</span>.",
			"num_responses": 2,
			"correct_responses": [
				"India",
				"China"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 8,
			"x": "Arable Area",
			"y": "Population",
			"prompt": "Select <span class='instruction_number'>one</span> country that had a decrease in <span class='instruction_emphasis'>Arable Area</span>, even as their <span class='instruction_emphasis'>Population</span> increased.",
			"num_responses": 1,
			"correct_responses": [
				"United States"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 5,
			"x": "Life Expectancy",
			"y": "Infant Mortality",
			"prompt": "Select <span class='instruction_number'>two</span> countries whose <span class='instruction_emphasis'>Infant Mortality</span> rate decreased the most.",
			"num_responses": 2,
			"correct_responses": [
				"Gambia",
				"Saudi Arabia"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 0,
			"x": "Population",
			"y": "GDP Per Capita",
			"prompt": "Select the <span class='instruction_number'>two</span> countries having the largest <span class='instruction_emphasis'>Population</span> in the year 2000.",
			"num_responses": 2,
			"correct_responses": [
				"India",
				"China"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": true
		},
		{
			"task_index": 7,
			"x": "Life Expectancy (Women)",
			"y": "Life Expectancy (Men)",
			"prompt": "Select <span class='instruction_number'>one</span> country where <span class='instruction_emphasis'>Life Expectancy</span> (<span class='instruction_emphasis'>Women</span> & <span class='instruction_emphasis'>Men</span>) increased first and decreased later.",
			"num_responses": 1,
			"correct_responses": [
				"Liberia",
				"Rwanda"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 3,
			"x": "Life Expectancy",
			"y": "Infant Mortality",
			"prompt": "Select <span class='instruction_number'>one</span> country with a decreasing <span class='instruction_emphasis'>Infant Mortality</span> rate, but little change in <span class='instruction_emphasis'>Life Expectancy</span>.",
			"num_responses": 1,
			"correct_responses": [
				"Hungary"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 2,
			"x": "Energy Consumption",
			"y": "GDP Per Capita",
			"prompt": "Select <span class='instruction_number'>three</span> countries that had little change in <span class='instruction_emphasis'>GDP Per Capita</span>.",
			"num_responses": 3,
			"correct_responses": [
				"Gambia",
				"Liberia",
				"Rwanda"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 4,
			"x": "Life Expectancy",
			"y": "Infant Mortality",
			"prompt": "Select <span class='instruction_number'>two</span> countries whose <span class='instruction_emphasis'>Infant Mortality</span> rate decreased first, then increased later.",
			"num_responses": 2,
			"correct_responses": [
				"Liberia",
				"Rwanda"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 1,
			"x": "Indexed Energy Consumption",
			"y": "Indexed GDP",
			"prompt": "Select <span class='instruction_number'>two</span> countries whose <span class='instruction_emphasis'>Indexed Energy Consumption</span> grew faster than their <span class='instruction_emphasis'>Indexed GDP</span>.",
			"num_responses": 2,
			"correct_responses": [
				"India",
				"China"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 9,
			"x": "Arable Area",
			"y": "Population",
			"prompt": "Select <span class='instruction_number'>one</span> country that had an increase in <span class='instruction_emphasis'>Arable Area</span>, but only a slight increase in <span class='instruction_emphasis'>Population</span>.",
			"num_responses": 1,
			"correct_responses": [
				"Australia"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		}
	],
	[
		{
			"task_index": -3,
			"x": "Energy Consumption",
			"y": "GDP Per Capita",
			"prompt": "Select the country that had the largest change in <span class='instruction_emphasis'>GDP Per Capita</span>.",
			"num_responses": 1,
			"correct_responses": [
				"Norway"
			],
			"yearMin": 1980,
			"yearMax": 2000,
			"tutorial": true,
			"quality_control": false
		},
		{
			"task_index": -2,
			"x": "Number of Personal Computers",
			"y": "GDP Per Capita",
			"prompt": "Select <span class='instruction_number'>three</span> countries with rapid growth in the <span class='instruction_emphasis'>Number of Personal Computers</span> between 1985 and 2000.",
			"num_responses": 3,
			"correct_responses": [
				"Denmark",
				"Iceland",
				"Norway",
				"Sweden",
				"United States",
				"Australia"
			],
			"yearMin": 1985,
			"yearMax": 2000,
			"tutorial": true,
			"quality_control": false
		},
		{
			"task_index": -1,
			"x": "Number of Personal Computers",
			"y": "Life Expectancy",
			"prompt": "Select <span class='instruction_number'>one</span> foo country with little growth in the <span class='instruction_emphasis'>Number of Personal Computers</span>.",
			"num_responses": 1,
			"correct_responses": [
				"Hungary"
			],
			"yearMin": 1985,
			"yearMax": 2000,
			"tutorial": true,
			"quality_control": false
		},
		{
			"task_index": 7,
			"x": "Life Expectancy (Women)",
			"y": "Life Expectancy (Men)",
			"prompt": "Select <span class='instruction_number'>one</span> country where <span class='instruction_emphasis'>Life Expectancy</span> (<span class='instruction_emphasis'>Women</span> & <span class='instruction_emphasis'>Men</span>) increased first and decreased later.",
			"num_responses": 1,
			"correct_responses": [
				"Liberia",
				"Rwanda"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 2,
			"x": "Energy Consumption",
			"y": "GDP Per Capita",
			"prompt": "Select <span class='instruction_number'>three</span> countries that had little change in <span class='instruction_emphasis'>GDP Per Capita</span>.",
			"num_responses": 3,
			"correct_responses": [
				"Gambia",
				"Liberia",
				"Rwanda"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 5,
			"x": "Life Expectancy",
			"y": "Infant Mortality",
			"prompt": "Select <span class='instruction_number'>two</span> countries whose <span class='instruction_emphasis'>Infant Mortality</span> rate decreased the most.",
			"num_responses": 2,
			"correct_responses": [
				"Gambia",
				"Saudi Arabia"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 6,
			"x": "Indexed Energy Consumption",
			"y": "Indexed Population",
			"prompt": "Select <span class='instruction_number'>two</span> countries whose <span class='instruction_emphasis'>Indexed Population</span> grew faster than their <span class='instruction_emphasis'>Indexed Energy Consumption</span>.",
			"num_responses": 2,
			"correct_responses": [
				"India",
				"China"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 4,
			"x": "Life Expectancy",
			"y": "Infant Mortality",
			"prompt": "Select <span class='instruction_number'>two</span> countries whose <span class='instruction_emphasis'>Infant Mortality</span> rate decreased first, then increased later.",
			"num_responses": 2,
			"correct_responses": [
				"Liberia",
				"Rwanda"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 1,
			"x": "Indexed Energy Consumption",
			"y": "Indexed GDP",
			"prompt": "Select <span class='instruction_number'>two</span> countries whose <span class='instruction_emphasis'>Indexed Energy Consumption</span> grew faster than their <span class='instruction_emphasis'>Indexed GDP</span>.",
			"num_responses": 2,
			"correct_responses": [
				"India",
				"China"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 3,
			"x": "Life Expectancy",
			"y": "Infant Mortality",
			"prompt": "Select <span class='instruction_number'>one</span> country with a decreasing <span class='instruction_emphasis'>Infant Mortality</span> rate, but little change in <span class='instruction_emphasis'>Life Expectancy</span>.",
			"num_responses": 1,
			"correct_responses": [
				"Hungary"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 8,
			"x": "Arable Area",
			"y": "Population",
			"prompt": "Select <span class='instruction_number'>one</span> country that had a decrease in <span class='instruction_emphasis'>Arable Area</span>, even as their <span class='instruction_emphasis'>Population</span> increased.",
			"num_responses": 1,
			"correct_responses": [
				"United States"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		},
		{
			"task_index": 0,
			"x": "Population",
			"y": "GDP Per Capita",
			"prompt": "Select the <span class='instruction_number'>two</span> countries having the largest <span class='instruction_emphasis'>Population</span> in the year 2000.",
			"num_responses": 2,
			"correct_responses": [
				"India",
				"China"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": true
		},
		{
			"task_index": 9,
			"x": "Arable Area",
			"y": "Population",
			"prompt": "Select <span class='instruction_number'>one</span> country that had an increase in <span class='instruction_emphasis'>Arable Area</span>, but only a slight increase in <span class='instruction_emphasis'>Population</span>.",
			"num_responses": 1,
			"correct_responses": [
				"Australia"
			],
			"yearMin": 1975,
			"yearMax": 2000,
			"tutorial": false,
			"quality_control": false
		}
	]
];

module.exports = taskList;