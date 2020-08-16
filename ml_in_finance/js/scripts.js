function build_test_companies(){
  test_companies = {};
  num_companies = (Math.floor(Math.random()*5) + 1)*100;
  for (i = 1; i <= num_companies; i++){
    test_companies[i] = [];
    test_companies[i].push("Startup" + i.toString());
    test_companies[i].push("Founder" + i.toString());
    test_companies[i].push("Description" + i.toString());
    test_companies[i].push(Math.ceil(Math.round(Math.random()*9 + 1)*1000000));
    test_companies[i].push(Math.round(Math.random()*80));
  }
  return test_companies;
}
function build_first_table(companies){
  $("#table1 tbody").empty();
  $("#table1").append("<tbody>")
  for (var k in companies){
    $("#table1").append("<tr><td>" +
                  companies[k][0] + "</td><td>" +
                  companies[k][1] + "</td><td>" +
                  companies[k][2] + "</td><td>" +
                  companies[k][3].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</td><td>" +
                  companies[k][4].toString()+ "%</td></tr>");
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
    return second[1][4] - first[1][4];
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
    d3.csv("./output/cleaned_outputs.csv").then(function(data) {
      console.log(data.slice(0,5); // [{"Hello": "world"}, …]
      console.log("HI");
    });
    table1 = $('#table1').DataTable();
    table2 = $('#table2').DataTable();
    var test_companies = {};
    $('#submit').on('click', function() {
      test_companies = build_test_companies();
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
