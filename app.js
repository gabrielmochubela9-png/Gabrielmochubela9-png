var T;
function render(i){var m=$('#main');if(i!==1)customers.sel=null;[dash,customers,sales,service][i](m)}
T=tabs(['Dashboard','Customers','Sales','Service'],render);
