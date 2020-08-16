function lerp(val1, val2, f_dif, range){
	return val1 + (val2 - val1) * (f_dif/range);
}
function date_dif(date1, date2) {

    // The number of milliseconds in one day
    const ONE_DAY = 1000 * 60 * 60 * 24;

    // Calculate the difference in milliseconds
    const differenceMs = Math.abs(date1 - date2);

    // Convert back to days and return
    return Math.round(differenceMs / ONE_DAY);

}
function build_test_companies(startDate, endDate, data, table1, table2){
  duration = date_dif(endDate, startDate);
  companies = {}
  reg_target_refs = ["prediction_200", "prediction_500", "prediction_1000", "prediction_2000"]
  for (var k in data){
    k = data[k];
    founded_on = new Date(k["founded_on"]);
    if(founded_on < startDate || founded_on > endDate){
      continue;
    }
    uid = k[""];
    companies[uid] = [];
    companies[uid].push(k["name"]);
    companies[uid].push(k["founded_on"]);
    companies[uid].push(k["founder_names"]);
    companies[uid].push(k["short_description"]);
    companies[uid].push(parseInt(k["initial_valuation"]));
    i = 0;
    if(duration >= 200 && duration < 500){i=0}
          else if(duration >= 500 && duration < 1000){i=1}
	  else {duration = 2}
    if(isNan(parseInt(k[reg_target_refs[i]]))){continue;}

    prediction = lerp(parseInt(k[reg_target_refs[i]]), parseInt(k[reg_target_refs[i+1]]), date_dif(founded_on, startDate), duration)/100;
    companies[uid].push(prediction);
  }
  table1.clear().draw();
  table1.destroy();
  table2.clear().draw();
  table2.destroy();
  return companies;
}
function build_first_table(companies){
  $("#table1 tbody").empty();
  $("#table1").append("<tbody>")
  for (var k in companies){
    $("#table1").append("<tr><td>" +
                  companies[k][0] + "</td><td>" +
                  companies[k][1] + "</td><td>" +
                  companies[k][2] + "</td><td>" +
                  companies[k][3] + "</td><td>" +
                  companies[k][4].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</td><td>" +
                  companies[k][5].toFixed(2).toString()+ "%</td></tr>");
  };
  $("#table1").append("</tbody>");
  table1 = $('#table1').DataTable();
  table2 = $('#table2').DataTable();
}
function change_expected_returns(val){
  $("#total_return").text("Portfolio Expected Returns: " + Math.round(val).toString() + "%");
}
function build_second_table(companies, nums){
  var items = Object.keys(companies).map(function(key) {
    return [key, companies[key]];
  });
  items.sort(function(first, second) {
    return second[1][5] - first[1][5];
  });
  table_dict = {};
  for (var k in items.slice(0, nums)){
    table_dict[items.slice(0, nums)[k][0]] = items.slice(0, nums)[k][1]
  }
  console.log(table_dict)
  $("#table2 tbody").empty();
  sum = 0;
  for (var k in table_dict){
    $("#table2").append("<tr><td>" + table_dict[k][0] + "</td><td>" +
                 table_dict[k][5].toFixed(2).toString() + "%</td></tr>");
    sum += table_dict[k][5];
	  console.log(table_dict[k][5]);
  }
	console.log(sum);
	console.log(nums);
  change_expected_returns(sum/nums);
}
$(document).ready(function() {
    output = [];
    d3.csv("./output/cleaned_outputs.csv").then(function(data) {
      output = data;
    });
    table1 = $('#table1').DataTable();
    table2 = $('#table2').DataTable();

    $('#submit').on('click', function() {
      startDate = new Date($("#startDate").val());
      endDate = new Date($("#endDate").val());
      test_companies = build_test_companies(startDate, endDate, output, table1, table2);
      build_first_table(test_companies);
    });
    $('.dropdown-menu a').on('click', function() {
      table2.clear().draw();
      table2.destroy();
      build_second_table(test_companies, parseInt(this.text));
      table2 = $('#table2').DataTable();
    });
} );
