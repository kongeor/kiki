(def map
  (fn [f coll]
    (if (nil? coll)
      nil
      (cons (f (car coll)) (map f (cdr coll))))))


