import requests

from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.renderers import TemplateHTMLRenderer

from .models import BarInfoModel


# Create your views here.

def home(request):
    return render(request, 'funlocal/index.html')

def users(request, pk):
    context = {'user': pk}
    return render(request, 'funlocal/users.html', context)


def get_data_from_xano():
    barInfoId = 3
    api_url = "https://x8ki-letl-twmt.n7.xano.io/api:JpiZp5ux/bar-info?barInfoId={}".format(barInfoId)
    response = requests.get(api_url)
    return response


class XanoDataView(APIView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'funlocal/landing.html'

    def get(self, request):
        data = get_data_from_xano()
        xano_data = BarInfoModel.from_dict(data.json())
        try:
            if data.status_code == 200:            
                return Response({'landing_page': xano_data.bar_info})
        
            else:
                return Response({'error': 'Failed to fetch data from XANO API'}, status=data.status_code)
        except data.exceptions.RequestException as e:
            error_message = f"An error occurred while making the request: {str(e)}"
            print(error_message)










        





  



