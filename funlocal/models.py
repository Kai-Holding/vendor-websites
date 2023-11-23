from django.db import models

# Create your models here.

from dataclasses import dataclass
from typing import Any, List, TypeVar, Type, cast, Callable


T = TypeVar("T")


def from_int(x: Any) -> int:
    assert isinstance(x, int) and not isinstance(x, bool)
    return x


def from_str(x: Any) -> str:
    assert isinstance(x, str)
    return x


def from_float(x: Any) -> float:
    assert isinstance(x, (float, int)) and not isinstance(x, bool)
    return float(x)


def to_float(x: Any) -> float:
    assert isinstance(x, float)
    return x


def to_class(c: Type[T], x: Any) -> dict:
    assert isinstance(x, c)
    return cast(Any, x).to_dict()


def from_list(f: Callable[[Any], T], x: Any) -> List[T]:
    assert isinstance(x, list)
    return [f(y) for y in x]


@dataclass
class BusinessTagsID:
    id: int
    label: str
    tag_photo_url: str
    type: str

    @staticmethod
    def from_dict(obj: Any) -> 'BusinessTagsID':
        assert isinstance(obj, dict)
        id = from_int(obj.get("id"))
        label = from_str(obj.get("label"))
        tag_photo_url = from_str(obj.get("tag_photo_url"))
        type = from_str(obj.get("type"))
        return BusinessTagsID(id, label, tag_photo_url, type)

    def to_dict(self) -> dict:
        result: dict = {}
        result["id"] = from_int(self.id)
        result["label"] = from_str(self.label)
        result["tag_photo_url"] = from_str(self.tag_photo_url)
        result["type"] = from_str(self.type)
        return result


@dataclass
class Data:
    lng: float
    lat: float

    @staticmethod
    def from_dict(obj: Any) -> 'Data':
        assert isinstance(obj, dict)
        lng = from_float(obj.get("lng"))
        lat = from_float(obj.get("lat"))
        return Data(lng, lat)

    def to_dict(self) -> dict:
        result: dict = {}
        result["lng"] = to_float(self.lng)
        result["lat"] = to_float(self.lat)
        return result


@dataclass
class Location:
    type: str
    data: Data

    @staticmethod
    def from_dict(obj: Any) -> 'Location':
        assert isinstance(obj, dict)
        type = from_str(obj.get("type"))
        data = Data.from_dict(obj.get("data"))
        return Location(type, data)

    def to_dict(self) -> dict:
        result: dict = {}
        result["type"] = from_str(self.type)
        result["data"] = to_class(Data, self.data)
        return result


@dataclass
class WorkingHoursOfBusinessFilteredByName:
    owner_business_id: int
    name: int
    open: int
    close: int

    @staticmethod
    def from_dict(obj: Any) -> 'WorkingHoursOfBusinessFilteredByName':
        assert isinstance(obj, dict)
        owner_business_id = from_int(obj.get("owner_business_id"))
        name = int(from_str(obj.get("name")))
        open = from_int(obj.get("open"))
        close = from_int(obj.get("close"))
        return WorkingHoursOfBusinessFilteredByName(owner_business_id, name, open, close)

    def to_dict(self) -> dict:
        result: dict = {}
        result["owner_business_id"] = from_int(self.owner_business_id)
        result["name"] = from_str(str(self.name))
        result["open"] = from_int(self.open)
        result["close"] = from_int(self.close)
        return result


@dataclass
class BarInfo:
    id: int
    created_at: int
    main_users_id: int
    price_range: int
    facebook_messenger_link: str
    website_url: str
    phone_number: str
    email: str
    address: str
    business_tags_id: List[BusinessTagsID]
    location: Location
    working_hours_of_business_filtered_by_name: List[WorkingHoursOfBusinessFilteredByName]

    @staticmethod
    def from_dict(obj: Any) -> 'BarInfo':
        assert isinstance(obj, dict)
        id = from_int(obj.get("id"))
        created_at = from_int(obj.get("created_at"))
        main_users_id = from_int(obj.get("main_users_id"))
        price_range = from_int(obj.get("price_range"))
        facebook_messenger_link = from_str(obj.get("facebook_messenger_link"))
        website_url = from_str(obj.get("website_url"))
        phone_number = from_str(obj.get("phone_number"))
        email = from_str(obj.get("email"))
        address = from_str(obj.get("address"))
        business_tags_id = from_list(BusinessTagsID.from_dict, obj.get("business_tags_id"))
        location = Location.from_dict(obj.get("location"))
        working_hours_of_business_filtered_by_name = from_list(WorkingHoursOfBusinessFilteredByName.from_dict, obj.get("_working_hours_of_business_filtered_by_name"))
        return BarInfo(id, created_at, main_users_id, price_range, facebook_messenger_link, website_url, phone_number, email, address, business_tags_id, location, working_hours_of_business_filtered_by_name)

    def to_dict(self) -> dict:
        result: dict = {}
        result["id"] = from_int(self.id)
        result["created_at"] = from_int(self.created_at)
        result["main_users_id"] = from_int(self.main_users_id)
        result["price_range"] = from_int(self.price_range)
        result["facebook_messenger_link"] = from_str(self.facebook_messenger_link)
        result["website_url"] = from_str(self.website_url)
        result["phone_number"] = from_str(self.phone_number)
        result["email"] = from_str(self.email)
        result["address"] = from_str(self.address)
        result["business_tags_id"] = from_list(lambda x: to_class(BusinessTagsID, x), self.business_tags_id)
        result["location"] = to_class(Location, self.location)
        result["_working_hours_of_business_filtered_by_name"] = from_list(lambda x: to_class(WorkingHoursOfBusinessFilteredByName, x), self.working_hours_of_business_filtered_by_name)
        return result


@dataclass
class BarInfoModel:
    bar_info: List[BarInfo]

    @staticmethod
    def from_dict(obj: Any) -> 'BarInfoModel':
        assert isinstance(obj, dict)
        bar_info = from_list(BarInfo.from_dict, obj.get("barInfo"))
        return BarInfoModel(bar_info)

    def to_dict(self) -> dict:
        result: dict = {}
        result["barInfo"] = from_list(lambda x: to_class(BarInfo, x), self.bar_info)
        return result


def bar_info_model_from_dict(s: Any) -> BarInfoModel:
    return BarInfoModel.from_dict(s)


def bar_info_model_to_dict(x: BarInfoModel) -> Any:
    return to_class(BarInfoModel, x)








