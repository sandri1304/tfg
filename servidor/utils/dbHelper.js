var dbHelper = {};

dbHelper.getPagination = function(params) {
    let pagination = {};

    if(params.pagination != null && params.pagination == false){
        pagination.pagination = false;
    }else{
        pagination.page = params.page != null ? params.page : 1;
        pagination.limit = params.pageSize != null ? params.pageSize : 20;
        pagination.collation = {
            locale: 'es'
        }
        if(params.sort != null){
            let order = params.order == 'desc' ? '-' : '';
            order+=params.sort;
            pagination.sort=order;
        }
    }

    const myCustomLabels = {
        docs: 'items',
        totalDocs: 'total_count',
        meta: null,
    };
    pagination.customLabels = myCustomLabels;

    return pagination;  

};

module.exports = dbHelper;