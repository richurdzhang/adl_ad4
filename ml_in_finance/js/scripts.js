function lerp(val1, val2, f_dif, range){
	return val1 + (val2 - val1) * (f_dif/range);
}
function date_dif(date1, date2){
  d = new Date(a.getTime() - c.getTime())
  return d.getUTCDate() - 1;
}
function build_test_companies(startDate, endDate, data){
  duration = date_dif(startDate, endDate);
  companies = {}
  reg_targets = [200, 500, 1000, 2000]
  reg_target_refs = ["prediction_200", "prediction_500", "prediction_1000", "prediction_2000"]
  for (var k in data){
    founded_on = new Date (k["founded_on"]);
    if(founded_on > startDate && founded_on < endDate){
      continue;
    }
    uid = k[""];
    companies[uid] = [];
    companies[uid].push(k["name"]);
    companies[uid].push(k["founded_on"]);
    companies[uid].push(k["founder_names"]);
    companies[uid].push(parseInt(k["initial_valuation"]));
    companies[uid].push(k["short_description"]);
    i = 0;
    for(; i < len(time_spans) - 1; i++){
      if(duration > reg_targets[i]){
        continue;
      }
    }
    prediction = lerp(parseInt(k[reg_target_refs[i]]), parseInt(k[reg_target_refs[i+1]]), date_dif(founded_on, startDate), duration)
    companies[uid].push(prediction);
  }
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
                  companies[k][5].toString()+ "%</td></tr>");
  };
  $("#table1").append("</tbody>");
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
                 table_dict[k][4].toString() + "%</td></tr>");
    sum += table_dict[k][4];
  }
  change_expected_returns(sum/nums);
}
$(document).ready(function() {
    output = [];
    d3.csv("./output/cleaned_outputs.csv").then(function(data) {
      console.log(data);
      output = data;
    });
    table1 = $('#table1').DataTable();
    table2 = $('#table2').DataTable();

    $('#submit').on('click', function() {
      startDate = new Date($("#startDate").val());
      endDate = new Date($("#endDate").val());
      test_companies = build_test_companies(startDate, endDate, output);
      table1.clear().draw();
      table1.destroy();
      table2.clear().draw();
      table2.destroy();
      build_first_table(test_companies);
      table1 = $('#table1').DataTable();
      table2 = $('#table2').DataTable();
    });
    $('.dropdown-menu a').on('click', function() {
      table2.clear().draw();
      table2.destroy();
      build_second_table(test_companies, parseInt(this.text));
      table2 = $('#table2').DataTable();
    });
} );