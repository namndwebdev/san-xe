Service
BonBanh => GetTotalPage, getPage 


Helper
Validate.js  
GetData: {
    fetchData1Page(soTrang, getTungTrang){
        let data = await soTrang ()
        DB.check(data) = > newData
        newData.forEach getTungTrang()
        return result 
    }

    fetchAll(){
        fetchData1Page(bonBanhService.getTotalpage, bonBanhService.getPage)
        fetchData1Page(aloService.getTotalpage, aloService.getPage)
        fetchData1Page(choTot.getTotalpage, choTot.getPage)
    }
}
    

    
Tôi cần làm đc 1 web 
    + Phải phân chia các việc cụ thể, có thể nhân bản được với các trang khác.
    + Tôi phải tìm cấu trúc search của web
    + Tôi phải lấy được trang đầu tiên (page 1)
    + Tôi phải lấy được tất cả số trang
    + Tôi phải lấy được toàn bộ trang search

Tôi cần nhân bản với nhiều web



