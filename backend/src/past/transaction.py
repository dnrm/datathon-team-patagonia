class Transaction:
    def __init__(self, id, date, merchant, merchant_category, sale_type, amount):
        self.id = id
        self.date = date
        self.merchant = merchant
        self.merchant_category = merchant_category
        self.sale_type = sale_type
        self.amount = float(amount) if amount != "" else 0.0 

    def __repr__(self):
        return (f"Transaction(id={self.id}, date={self.date}, "
                f"merchant={self.merchant}, amount={self.amount})")